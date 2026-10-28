import {
  DATA_NOTE,
  DISCLAIMER,
  buildWarnings,
  findAlternatives,
  findProductByRegNo,
  pickBestMatch,
  searchProducts,
} from "@/lib/medicine";
import { cleanText } from "@/lib/saltKey";

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const query = cleanText(params.get("q"));
    const strength = cleanText(params.get("strength"));
    const regNo = cleanText(params.get("reg_no"));

    if (!query && !regNo) {
      return Response.json(
        { error: "Please provide a medicine name using the q parameter." },
        { status: 400 }
      );
    }

    if (query && query.length < 2) {
      return Response.json(
        { error: "Please enter at least 2 characters to search." },
        { status: 400 }
      );
    }

    const product = regNo
      ? await findProductByRegNo(regNo)
      : pickBestMatch(await searchProducts(query), query, strength);

    const alternatives = product ? await findAlternatives(product) : [];
    const warnings = buildWarnings({ product, regNo });

    return Response.json({
      query: { q: query || null, strength: strength || null, reg_no: regNo || null },
      product,
      alternatives,
      warnings,
      disclaimer: DISCLAIMER,
      dataNote: DATA_NOTE,
    });
  } catch (error) {
    console.error("GET /api/search failed:", error);
    return Response.json(
      { error: "Search is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
