import dbConnect from "@/db/connect";
import Prompt from "@/db/models/Prompt";
import mongoose from "mongoose";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "Invalid ID format" });
  }

  if (request.method === "GET") {
    try {
      const prompt = await Prompt.findById(id).populate("categories");

      if (!prompt) {
        return response.status(404).json({ error: "Prompt not found" });
      }

      return response.status(200).json(prompt);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === "DELETE") {
    try {
      const prompt = await Prompt.findById(id);

      if (!prompt) {
        return response.status(404).json({ status: "Prompt not found" });
      }

      await prompt.deleteOne();

      return response
        .status(200)
        .json({ status: "Prompt successfully deleted" });
    } catch (error) {
      return response
        .status(500)
        .json({ status: "error", message: error.message });
    }
  }

  if (request.method === "PUT") {
    const { answer, question, categories } = request.body;

    try {
      const prompt = await Prompt.findById(id);
      if (!prompt) {
        return response
          .status(404)
          .json({ status: "error", message: "Prompt not found." });
      }

      prompt.answer = answer;
      prompt.question = question;
      prompt.categories = categories;

      await prompt.save();
      const populated = await prompt.populate("categories");
      return response.status(200).json(populated);
    } catch (error) {
      console.error("PUT /api/prompt/[id] error:", error);
      return response.status(500).json({
        status: "error",
        message: "Database update failed.",
      });
    }
  }

  return response.status(405).json({ status: "Method not allowed" });
}
