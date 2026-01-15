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
      });

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
      const { newScore, promptId } = request.body;

      const user = await User.findOne({
        authProviderId: id,
      });
      if (!user) {
        return response.status(400).json({ error: "User not found" });
      }

      if (promptId !== undefined) {
        const isBookmarked = user.bookmarks.includes(promptId);

        if (isBookmarked) {
          user.bookmarks = user.bookmarks.filter(
            (bookmark) => bookmark.toString() !== promptId
          );
          await user.save();
          return response.status(200).json({
            message: "Bookmark removed",
            bookmarks: user.bookmarks,
          });
        } else {
          user.bookmarks.push(promptId);
          await user.save();
          return response.status(200).json({
            message: "Bookmark added",
            bookmarks: user.bookmarks,
          });
        }
      }

      if (newScore !== undefined && newScore !== null) {
        if (newScore > user.highscore) {
          user.highscore = newScore;
          await user.save();
          return response.status(200).json({
            message: "Highscore updated",
            highscore: user.highscore,
          });
        }

        return response.status(200).json({
          message: "Score not higher than current highscore",
          highscore: user.highscore,
        });
      }

      return response.status(400).json({ error: "No valid data provided" });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}
