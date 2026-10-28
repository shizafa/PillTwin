import dns from "node:dns/promises";
import net from "node:net";
import tls from "node:tls";

const HOST = "eapp.dra.gov.pk";
const PORT = 443;

function report(step, ok, detail) {
  console.log(`${ok ? "OK  " : "FAIL"}  ${step}${detail ? ` — ${detail}` : ""}`);
}

async function checkDns() {
  try {
    const addresses = await dns.lookup(HOST, { all: true });
    report("DNS lookup", true, addresses.map((a) => a.address).join(", "));
    return true;
  } catch (error) {
    report("DNS lookup", false, error.code || error.message);
    return false;
  }
}

function checkTcp() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: HOST, port: PORT, timeout: 15000 });
    socket.on("connect", () => {
      report("TCP connect to port 443", true);
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      report("TCP connect to port 443", false, "timed out after 15s");
      socket.destroy();
      resolve(false);
    });
    socket.on("error", (error) => {
      report("TCP connect to port 443", false, error.code || error.message);
      resolve(false);
    });
  });
}

function checkTls() {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: HOST, port: PORT, servername: HOST, timeout: 15000, minVersion: "TLSv1" },
      () => {
        const cert = socket.getPeerCertificate();
        report(
          "TLS handshake",
          true,
          `${socket.getProtocol()}, cert for ${cert?.subject?.CN || "unknown"}, valid to ${cert?.valid_to || "unknown"}, authorized=${socket.authorized}`
        );
        if (!socket.authorized) {
          report("  certificate trust", false, socket.authorizationError);
        }
        socket.destroy();
        resolve(true);
      }
    );
    socket.on("timeout", () => {
      report("TLS handshake", false, "timed out after 15s");
      socket.destroy();
      resolve(false);
    });
    socket.on("error", (error) => {
      report("TLS handshake", false, error.code || error.message);
      resolve(false);
    });
  });
}

async function checkHttp() {
  const url = `https://${HOST}/productView.php?searchGeneric=Paracetamol&_type=${encodeURIComponent("generic name")}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Referer: `https://${HOST}/WebProductIndex.php`,
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    const body = await response.text();
    report("HTTPS GET productView.php", true, `HTTP ${response.status}, ${body.length} bytes`);
    console.log(`\nFirst 300 characters of the response:\n${body.slice(0, 300)}`);
  } catch (error) {
    const code = error.cause?.code || error.code || error.name;
    report("HTTPS GET productView.php", false, code || error.message);
  } finally {
    clearTimeout(timer);
  }
}

console.log(`Diagnosing ${HOST}\n`);
const dnsOk = await checkDns();
if (dnsOk) {
  const tcpOk = await checkTcp();
  if (tcpOk) {
    await checkTls();
    await checkHttp();
  }
}
console.log("\nIf DNS passes but TCP fails, the site is blocking or unreachable from this network.");
console.log("If TCP passes but TLS fails, it is a certificate or TLS-version problem.");
console.log("If TLS passes but HTTPS fails, the server rejected the request itself.");
