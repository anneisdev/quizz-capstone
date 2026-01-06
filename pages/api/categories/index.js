import dbConnect from "@/db/connect";
import Category from "@/db/models/Category";
import Prompt from "@/db/models/Prompt";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const categories = await Category.find();
      return response.status(200).json(categories);
    } catch (error) {
      console.error("GET /categories error: ", error);
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === "POST") {
    try {
      const categoryData = request.body;
      const newCategory = await Prompt.create(categoryData);

      return response.status(201).json(newCategory);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ status: "Method not allowed" });
}
