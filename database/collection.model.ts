import { model, models, Schema, Types } from "mongoose";

interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

const collectionSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const Collection =
  models?.Collection || model<ICollection>("Collection", collectionSchema);
export default Collection;
