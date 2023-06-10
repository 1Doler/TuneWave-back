import mongoose from "mongoose";

const UserShema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    subscribersCount: {
      type: Number,
      default: 0,
    },
    listenersCount: {
      type: Number,
      default: 0,
    },
    songsCount: {
      type: Number,
      default: 0,
    },
    description: String,
    bgImage: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserShema);
