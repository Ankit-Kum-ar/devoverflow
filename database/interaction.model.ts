import { model, models, Schema, Types, Document } from "mongoose";

interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId; // ID of the question or answer involved in the interaction
  actionType: string; // Type of the action (question or answer)
}

export interface IInteractionDoc extends IInteraction, Document {}
export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

const interactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: InteractionActionEnums, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true }, // ID of the question or answer involved in the interaction
    actionType: { type: String, enum: ["question", "answer"], required: true }, // Type of the action (question or answer)
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", interactionSchema);
export default Interaction;
