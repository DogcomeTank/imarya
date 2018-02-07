
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductQtySchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    locationId:{
        type: Schema.Types.ObjectId,
        ref: 'Locations'
    },
    qty: String, 
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const ProductQty = mongoose.model('ProductQty',ProductQtySchema);

module.exports = ProductQty;
