// app/api/categories/route.js
import Category from "@/app/models/Category";
import { NextResponse } from "next/server";

// GET all categories
export async function GET() {
  try {
    const categories = await Category.find({});
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories", error },
      { status: 500 }
    );
  }
}

// POST to add a new category
export async function POST(req) {
  try {
    const { name } = await req.json();

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    const categories = await Category.find({});
    return NextResponse.json({ categories }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding category", error },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(req) {
  try {
    const { name } = await req.json();

    // Remove the category from the database
    await Category.findOneAndDelete({ name });

    const categories = await Category.find({});
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting category", error },
      { status: 500 }
    );
  }
}
