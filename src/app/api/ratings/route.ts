import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RatingPayload {
  doctorId: string;
  document_id: number;
  rating: number; // 1-5
  reason?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RatingPayload;
    if (!body.doctorId || !body.document_id || !body.rating) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("documentRatings");

    // upsert
    await collection.updateOne(
      { doctorId: body.doctorId, document_id: body.document_id },
      { $set: { rating: body.rating, reason: body.reason || "", updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erreur POST /api/ratings", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  if (!doctorId) return NextResponse.json({ error: "doctorId requis" }, { status: 400 });
  try {
    const db = await getDb();
    const collection = db.collection("documentRatings");
    const docs = await collection.find({ doctorId }).toArray();
    return NextResponse.json({ ratings: docs });
  } catch (e) {
    console.error("Erreur GET /api/ratings", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
