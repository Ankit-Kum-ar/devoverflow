import { model, models, Schema, Types } from "mongoose";

interface Iinteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId; // ID of the question or answer involved in the interaction
  actionType: "question" | "answer"; // Type of the action (question or answer)
}

const interactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true }, // ID of the question or answer involved in the interaction
    actionType: { type: String, enum: ["question", "answer"], required: true }, // Type of the action (question or answer)
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction || model<Iinteraction>("Interaction", interactionSchema);
export default Interaction;
