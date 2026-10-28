import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact" })
      .limit(1);

    if (error) {
      return Response.json(
        { ok: false, message: "Could not reach the products table.", error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, message: "Connected to Supabase.", productCount: count });
  } catch (err) {
    return Response.json(
      { ok: false, message: "Unexpected error connecting to Supabase.", error: err.message },
      { status: 500 }
    );
  }
}
