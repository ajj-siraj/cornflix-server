const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    public: {
      type: Boolean,
      default: true,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    // lastWatched: {
    //   ref: 'Movie'
    // }
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

let Users = mongoose.model("User", userSchema);

module.exports = Users;
