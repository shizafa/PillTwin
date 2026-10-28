import fs from "node:fs";
import path from "node:path";
import {
  buildProductRecord,
  fetchProductDetailHtml,
  findGenerics,
  listProductsByGeneric,
  matchesWholeWord,
  parseProductDetailHtml,
} from "../src/lib/drap.js";

const GENERICS = [
  "Paracetamol",
  "Ibuprofen",
  "Diclofenac",
  "Omeprazole",
  "Esomeprazole",
  "Pantoprazole",
  "Amoxicillin",
  "Azithromycin",
  "Ciprofloxacin",
  "Cefixime",
  "Metronidazole",
  "Metformin",
  "Atorvastatin",
  "Amlodipine",
  "Losartan",
  "Montelukast",
  "Cetirizine",
  "Levofloxacin",
];

const POLITE_DELAY_MS = 1500;
const OUTPUT_CSV = path.join(process.cwd(), "drap_products.csv");
const PROBE_FILE = path.join(process.cwd(), "drap-probe.json");

const CSV_COLUMNS = [
  "reg_no",
  "brand",
  "generic",
  "strength",
  "dosage_form",
  "salt_key",
  "manufacturer",
  "composition",
  "status",
  "pack_size",
  "mrp",
  "source",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toCsvValue(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(records) {
  const lines = [CSV_COLUMNS.join(",")];
  for (const record of records) {
    lines.push(CSV_COLUMNS.map((column) => toCsvValue(record[column])).join(","));
  }
  return lines.join("\n");
}

async function probe(term) {
  console.log(`Probing DRAP for "${term}"...`);
  const generics = await findGenerics(term, { timeoutMs: 20000 });
  console.log(`  findGenerics returned ${generics.length} result(s)`);

  const match = generics.find((item) => matchesWholeWord(item.id ?? item.text, term));
  if (!match) {
    fs.writeFileSync(PROBE_FILE, JSON.stringify({ term, generics }, null, 2));
    console.log(`  No whole-word match. Raw output written to ${PROBE_FILE}`);
    return;
  }

  await sleep(POLITE_DELAY_MS);
  const products = await listProductsByGeneric(match.id, { timeoutMs: 20000 });
  console.log(`  listProductsByGeneric returned ${products.length} product(s)`);

  const sample = products[0];
  let detailHtml = null;
  let detailFields = null;
  let record = null;

  if (sample?.registrationNo) {
    await sleep(POLITE_DELAY_MS);
    detailHtml = await fetchProductDetailHtml(sample.registrationNo, { timeoutMs: 20000 });
    detailFields = parseProductDetailHtml(detailHtml);
    record = buildProductRecord({ listItem: sample, detailFields });
  }

  fs.writeFileSync(
    PROBE_FILE,
    JSON.stringify(
      { term, matchedGeneric: match, firstProduct: sample, detailFields, record, detailHtml },
      null,
      2
    )
  );

  console.log("\n  Parsed detail fields:", detailFields);
  console.log("\n  Built record:", record);
  console.log(`\nFull raw output written to ${PROBE_FILE}`);
}

async function scrapeGeneric(term) {
  const generics = await findGenerics(term);
  const matches = generics.filter((item) => matchesWholeWord(item.id ?? item.text, term));
  if (matches.length === 0) {
    console.log(`  no whole-word match for "${term}", skipping`);
    return [];
  }

  const records = [];
  for (const match of matches) {
    await sleep(POLITE_DELAY_MS);
    const products = await listProductsByGeneric(match.id);
    console.log(`  ${match.id}: ${products.length} product(s)`);

    for (const product of products) {
      if (!product.registrationNo) continue;
      await sleep(POLITE_DELAY_MS);
      try {
        const html = await fetchProductDetailHtml(product.registrationNo);
        const detailFields = parseProductDetailHtml(html);
        records.push(buildProductRecord({ listItem: product, detailFields }));
      } catch (error) {
        console.log(`    failed ${product.registrationNo}: ${error.message}`);
      }
    }
  }
  return records;
}

async function scrapeAll() {
  const all = [];
  const seenRegNos = new Set();

  for (const term of GENERICS) {
    console.log(`\n${term}`);
    try {
      const records = await scrapeGeneric(term);
      for (const record of records) {
        if (!record.reg_no || seenRegNos.has(record.reg_no)) continue;
        seenRegNos.add(record.reg_no);
        all.push(record);
      }
      fs.writeFileSync(OUTPUT_CSV, toCsv(all));
    } catch (error) {
      console.log(`  failed: ${error.message}`);
    }
  }

  console.log(`\nDone. ${all.length} products written to ${OUTPUT_CSV}`);
}

const [, , flag, value] = process.argv;

if (flag === "--probe") {
  probe(value || "Paracetamol").catch((error) => {
    console.error(`Probe failed: ${error.message}`);
    process.exit(1);
  });
} else {
  scrapeAll().catch((error) => {
    console.error(`Scrape failed: ${error.message}`);
    process.exit(1);
  });
}
