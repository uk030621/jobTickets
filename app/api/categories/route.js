import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

// Fetch categories (GET) or Add a category (POST) or Delete a category (DELETE)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ticket-db");
    const collection = db.collection("categories");

    const categories = await collection.find({}).toArray();
    return NextResponse.json({ categories: categories.map((cat) => cat.name) });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { name } = await request.json();

  if (!name) {
    return NextResponse.json(
      { error: "Category name is required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("ticket-db");
    const collection = db.collection("categories");

    await collection.insertOne({ name });

    const categories = await collection.find({}).toArray();
    return NextResponse.json(
      { categories: categories.map((cat) => cat.name) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { name } = await request.json();

  if (!name) {
    return NextResponse.json(
      { error: "Category name is required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("ticket-db");
    const collection = db.collection("categories");

    await collection.deleteOne({ name });

    const categories = await collection.find({}).toArray();
    return NextResponse.json({ categories: categories.map((cat) => cat.name) });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
