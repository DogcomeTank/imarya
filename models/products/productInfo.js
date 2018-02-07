
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ProductInfoSchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    description: String,
    price: String,
});
const ProductInfo = mongoose.model('ProductInfo',ProductInfoSchema);

module.exports = ProductInfo;
