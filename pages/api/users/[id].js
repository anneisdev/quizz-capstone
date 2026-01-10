import dbConnect from "@/db/connect";
import User from "@/db/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session) {
    response.status(401).json({ status: "Not authorized" });
    return;
  }

  const { id } = request.query;
  if (id !== session.user.id) {
    return response.status(400).json({ error: "Forbidden" });
  }

  await dbConnect();

  if (request.method === "GET") {
    try {
      const user = await User.findOne({
        authProviderId: id,
      })

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

      return response.status(200).json(user);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === "PATCH") {
    try {
      const { promptId, action } = request.body;
      if (!promptId || !action) {
        return response
          .status(400)
          .json({ error: "Prompt or action not found" });
      }

      const user = await User.findOne({
        authProviderId: id,
      });
      if (!user) {
        return response.status(400).json({ error: "User not found" });
      }
    } catch {}
  }

  return response.status(405).json({ status: "Method not allowed" });
}
