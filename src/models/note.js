import { Schema, model } from "mongoose";
import { TAGS } from "../constants/tags.js";

const notesSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    default: "",
    trim: true
  },
  tag: {
    type: String,
    default: "Todo",
    enum: TAGS,
  }
}, {
  timestamps: true,
});

notesSchema.index({
  tag: 1,
});
export const Note = model("Note", notesSchema);
