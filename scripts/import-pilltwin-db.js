import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { getSupabase } from "../src/lib/supabase.js";
import { cleanText, extractStrength, makeSaltKey, normalizeDosageForm } from "../src/lib/saltKey.js";

const DB_PATH = path.join(process.cwd(), "pilltwin.db");
const BATCH_SIZE = 500;
const SOURCE = "drap_scrape";

function buildRecord(medicine, ingredients) {
  const genericNameInput =
    ingredients.length > 0
      ? ingredients.map((ingredient) => ingredient.name).join("+")
      : cleanText(medicine.composition_raw) || cleanText(medicine.name);

  const strength = extractStrength(medicine.composition_raw || "");
  const regNo = cleanText(medicine.reg_no);

  return {
    reg_no: regNo,
    brand: cleanText(medicine.name) || regNo || "Unknown",
    generic: cleanText(genericNameInput),
    strength: strength || null,
    dosage_form: normalizeDosageForm(medicine.dosage_form || "") || null,
    salt_key: makeSaltKey(genericNameInput, strength),
    manufacturer: cleanText(medicine.company) || null,
    composition: cleanText(medicine.composition_raw) || null,
    status: cleanText(medicine.status) || null,
    pack_size: null,
    mrp: null,
    source: SOURCE,
  };
}

async function main() {
  const limitArgIndex = process.argv.indexOf("--limit");
  const limit = limitArgIndex === -1 ? null : Number.parseInt(process.argv[limitArgIndex + 1], 10);

  console.log(`Opening ${DB_PATH}...`);
  const db = new DatabaseSync(DB_PATH, { readOnly: true });

  console.log("Reading ingredients...");
  const ingredientsByRegNo = new Map();
  for (const row of db.prepare("SELECT reg_no, name FROM ingredients").iterate()) {
    const list = ingredientsByRegNo.get(row.reg_no);
    if (list) list.push(row);
    else ingredientsByRegNo.set(row.reg_no, [row]);
  }

  console.log("Reading medicines...");
  const medicineQuery = `SELECT reg_no, name, status, dosage_form, company, composition_raw
    FROM medicines WHERE reg_no IS NOT NULL AND reg_no != ''${limit ? ` LIMIT ${limit}` : ""}`;
  const medicines = db.prepare(medicineQuery).all();
  db.close();

  console.log(`Building ${medicines.length} product records...`);
  const records = medicines.map((medicine) =>
    buildRecord(medicine, ingredientsByRegNo.get(medicine.reg_no) ?? [])
  );

  const supabase = getSupabase();
  let done = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("products").upsert(batch, { onConflict: "reg_no" });
    if (error) {
      console.error(`Batch starting at row ${i} failed: ${error.message}`);
      process.exit(1);
    }
    done += batch.length;
    console.log(`Upserted ${done}/${records.length}`);
  }

  console.log(`Done. ${done} products imported into Supabase.`);
}

main().catch((error) => {
  console.error(`Import failed: ${error.message}`);
  process.exit(1);
});
