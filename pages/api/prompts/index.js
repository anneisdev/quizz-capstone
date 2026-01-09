import dbConnect from "@/db/connect";
import Prompt from "@/db/models/Prompt";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();
  const session = await getServerSession(request, response, authOptions);

  if (request.method === "GET") {
    if (!session) {
      response.status(401).json({ status: "Not authorized" });
      return;
    }
    try {
      const prompts = await Prompt.find()
        .populate("categories")
        .sort({ _id: -1 });

      return response.status(200).json(prompts);
    } catch (error) {
      console.error("GET /prompts error: ", error);
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === "POST") {
    try {
      const promptData = request.body;
      const newPrompt = await Prompt.create(promptData);

      return response.status(201).json(newPrompt);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ status: "Method not allowed" });
}
