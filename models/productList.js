//"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"
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
})

const Products = mongoose.model('Products', ProductSchema);

module.exports = Products;
