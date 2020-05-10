const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    imdbID: {
        type: String,
    },
    imdbRating: {
        type: Number | String
    },
    imdbVotes: {
        type: String,
    },
    Poster: {
        type: String,
    },
    Type: {
        type: String,
    },
    Runtime: {
        type: String,
    },
    Awards: {
        type: String,
    },
    Genre: {
        type: String,
    },
    Year: {
        type: Number,
    },
    Actors: {
        type: String,
    },
    Released: {
        type: Number,
    },
    Director: {
        type: String,
    },
    Metascore: {
        type: Number,
    },
    Writer: {
        type: String,
    },
    Country: {
        type: String,
    },
    Language: {
        type: String,
    },
    Title: {
        type: String,
    },
    Response: {
        type: String,
    },
    Rated: {
        type: String,
    },
    Plot: {
        type: String,
    }
    
});

let Movies = mongoose.model('Movie', movieSchema);

module.exports = Movies;