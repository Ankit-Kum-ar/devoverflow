import { model, models, Schema, Types } from "mongoose";

interface ITagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}

const tagQuestionSchema = new Schema(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>("TagQuestion", tagQuestionSchema);
export default TagQuestion;
