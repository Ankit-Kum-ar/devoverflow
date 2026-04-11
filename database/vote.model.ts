import { model, models, Schema, Types } from "mongoose";

interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId; // question or answer id
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
}

const voteSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", voteSchema);
export default Vote;
