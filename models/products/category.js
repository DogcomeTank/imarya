
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const Category = mongoose.model('Category',CategorySchema);

module.exports = Category;
