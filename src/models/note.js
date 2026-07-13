import { Schema, model } from "mongoose";

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
    enum: [
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
    "Ideas",
    "Travel",
    "Finance",
    "Health",
    "Important",
    "Todo",
  ],
  }
}, {
  timestamps: true,
});

notesSchema.index({
  tag: 1,
});
export const Note = model("Note", notesSchema);
