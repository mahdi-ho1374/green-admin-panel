import mongoose, { Schema } from "mongoose";
import type { IComment } from "../types/comment";

const commentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      required: true,
    },
    seen: {
      type: Boolean,
      required: true,
    },
    replied: {
      type: Boolean,
      required: true,
    },
    repliedText: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", commentSchema);
