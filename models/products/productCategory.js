
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    CategoryId:{
        type: Schema.Types.ObjectId,
        ref: 'Categorys'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const ProductCategory = mongoose.model('ProductCategory',CategorySchema);

module.exports = ProductCategory;
