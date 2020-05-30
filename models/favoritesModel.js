const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let Favorite = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
}, {
  timestamps: true
});

let Favorites = mongoose.model("Favorite", Favorite);
module.exports = Favorites;
