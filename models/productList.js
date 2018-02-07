
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: String,
    description: String,
    by: String,
    img: String,
    tag: Array,
    price: String,
    createDay: {
        type: Date,
        default: Date.now
    }
});

const ProductInfoSchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
});

const Products = mongoose.model('Products', ProductSchema);
const ProductInfo = mongoose.model('ProductInfo',ProductInfoSchema);

module.exports = Products;
