import mongoose from "mongoose";
import "./Category";

const { Schema } = mongoose;

const promptSchema = new Schema({
  question: { type: String, required: true, minlength: 3 },
  answer: { type: String, required: true },
  categories: {
    type: [Schema.Types.ObjectId],
    ref: "Category",
    required: true,
  },
  owner: { type: String, required: true },
});

const Prompt = mongoose.models.Prompt || mongoose.model("Prompt", promptSchema);

export default Prompt;
