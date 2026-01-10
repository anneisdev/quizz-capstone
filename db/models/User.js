import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  authProviderId: { type: String, required: true, unique: true },
  highscore: { type: Number, default: 0 },
  bookmarks: { type: [Schema.Types.ObjectId], ref: "Prompt", default: [] },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
