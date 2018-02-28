const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: String,
    description: String,
    by: String,
    img: String,
    price: String,
    createDay: {
        type: Date,
        default: Date.now
    }
});

const CategorySchema = new Schema({
    category: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const LocationSchema = new Schema({
    location: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const ProductCategorySchema = new Schema({
    productId:{ type: Schema.Types.ObjectId, ref: 'Products' },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
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

const ProductQtySchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    locationId:{
        type: Schema.Types.ObjectId,
        ref: 'Locations'
    },
    qty: {
        type: String,
        default: '0',
    }, 
    size:{
        type: String,
        default: null,
    },
    color:{
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const ProductQty = mongoose.model('ProductQty',ProductQtySchema);
// const ProductInfo = mongoose.model('ProductInfo',ProductInfoSchema);
const ProductHistory = mongoose.model('ProductHistory',ProductHistorySchema);
const ProductCategory = mongoose.model('ProductCategory',ProductCategorySchema);
const PLocation = mongoose.model('Location',LocationSchema);
const Category = mongoose.model('Category',CategorySchema);
const Products = mongoose.model('Products', ProductSchema);

module.exports = {
    Products: Products,
    Category: Category,
    PLocation: PLocation,
    ProductCategory: ProductCategory,
    ProductHistory: ProductHistory,
    // ProductInfo: ProductInfo,
    ProductQty: ProductQty,
};