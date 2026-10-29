import { readPack } from "@/lib/gemma";
import {
  DATA_NOTE,
  DISCLAIMER,
  buildWarnings,
  findAlternatives,
  findProductFromPack,
} from "@/lib/medicine";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export async function POST(request) {
  try {
    let formData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        { error: "Send the photo as multipart form data with a field named image." },
        { status: 400 }
      );
    }

    const image = formData.get("image");

    if (!image || typeof image === "string") {
      return Response.json(
        { error: "Please attach a photo of the medicine box in a field named image." },
        { status: 400 }
      );
    }

    if (image.type && !image.type.startsWith("image/")) {
      return Response.json(
        { error: "That file is not an image. Please upload a photo of the medicine box." },
        { status: 400 }
      );
    }

    if (image.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: "That photo is too large. Please use an image under 10MB." },
        { status: 400 }
      );
    }

    const base64Image = Buffer.from(await image.arrayBuffer()).toString("base64");
    const pack = await readPack(base64Image, image.type || "image/jpeg");

    const product = await findProductFromPack(pack);
    const alternatives = product ? await findAlternatives(product) : [];
    const warnings = buildWarnings({ product, regNo: pack.reg_no, expiry: pack.expiry });

    return Response.json({
      pack,
      product,
      alternatives,
      warnings,
      disclaimer: DISCLAIMER,
      dataNote: DATA_NOTE,
    });
  } catch (error) {
    console.error("POST /api/scan failed:", error);
    return Response.json(
      { error: "We could not read that photo. Please try again with a clearer picture of the box." },
      { status: 502 }
    );
  }
}
