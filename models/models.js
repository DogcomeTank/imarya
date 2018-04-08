const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    ipn: {
        type: Number,
        unique: true,
    },
    productName: String,
    description: String,
    by: String,
    img: String,
    price: String,
    availability: {
        type: Number,
        default: 0
    },
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
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const ProductHistorySchema = new Schema({
    productId: {
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
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    locationId: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    qty: {
        type: Number,
        default: '0',
    },
    size: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const TokenSchema = new Schema({
    token: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
});

const UserCartSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,  
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    productQtyId: {
        type: Schema.Types.ObjectId,
        ref: 'ProductQty',
        // required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const ProductQty = mongoose.model('ProductQty', ProductQtySchema);
const ProductHistory = mongoose.model('ProductHistory', ProductHistorySchema);
const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);
const Location = mongoose.model('Location', LocationSchema);
const Category = mongoose.model('Category', CategorySchema);
const Products = mongoose.model('Products', ProductSchema);
const Token = mongoose.model('Token', TokenSchema);
const UserCart = mongoose.model('UserCart', UserCartSchema);

module.exports = {
    Products: Products,
    Category: Category,
    Location: Location,
    ProductCategory: ProductCategory,
    ProductHistory: ProductHistory,
    ProductQty: ProductQty,
    Token: Token,
    UserCart: UserCart,
};