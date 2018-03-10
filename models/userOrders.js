
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOrdersSchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    qty: Number, 
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const UserOrders = mongoose.model('ProductQty',UserOrdersSchema);

module.exports = UserOrders;
