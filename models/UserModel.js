import mongoose from "mongoose";

const UserShema = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    secondName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      require: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserShema);
