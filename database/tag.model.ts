import { Document, model, models, Schema } from "mongoose";

interface ITag {
  name: string;
  questions: number;
}

export interface ITagDoc extends ITag, Document {}

const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model<ITag>("Tag", tagSchema);
export default Tag;
