import dbConnect from "@/db/connect";
import User from "@/db/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response.status(401).json({ status: "Not authorized" });
  }

  await dbConnect();

  if (request.method === "GET") {
    try {
      const topUsers = await User.find({
        name: { $exists: true, $ne: null, $ne: "" },
      })
        .select("name highscore")
        .sort({ highscore: -1 })
        .limit(5);

      return response.status(200).json(topUsers);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}
