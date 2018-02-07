
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductHistorySchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    action: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const ProductHistory = mongoose.model('ProductHistory',ProductHistorySchema);

module.exports = ProductHistory;
