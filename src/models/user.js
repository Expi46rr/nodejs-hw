import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
    trim: true
  },
  password: {
    type: String,
    required: true,

  }
}, {
  timestamps: true,
});

userSchema.pre("save", function () {
  if (!this.username) {
    this.username = this.email;
  }
});
userSchema.methods.toJSON = function () {
  const object = this.toObject();
  delete object.password;
  return object;
 };

export const User = model("User", userSchema);
