// app/models/Category.js
import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
