import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "categories.json");

// GET: Fetch all categories
export async function GET() {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const categories = JSON.parse(fileData);
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Add a new category
export async function POST(req) {
  try {
    const { name } = await req.json(); // Category name from client request

    // Read existing categories from JSON
    const fileData = fs.readFileSync(filePath, "utf-8");
    const categories = JSON.parse(fileData);

    // Check for duplicates
    if (categories.includes(name)) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Add new category to the list
    categories.push(name);

    // Write the updated categories back to the file
    fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to add category" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a category
export async function DELETE(req) {
  try {
    const { name } = await req.json(); // Category name to delete

    // Read existing categories from JSON
    const fileData = fs.readFileSync(filePath, "utf-8");
    let categories = JSON.parse(fileData);

    // Check if the category exists
    if (!categories.includes(name)) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Remove the category from the list
    categories = categories.filter((category) => category !== name);

    // Write the updated categories back to the file
    fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to delete category" },
      { status: 500 }
    );
  }
}
