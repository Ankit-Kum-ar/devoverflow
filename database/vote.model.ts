import { model, models, Schema, Types } from "mongoose";

interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId; // question or answer id
  actionType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

const voteSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", voteSchema);
export default Vote;
