const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;



const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const AudiobookSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    AUTHOR: String,
    genre: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);



AudiobookSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/audiobooks/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});



AudiobookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Audiobook', AudiobookSchema);