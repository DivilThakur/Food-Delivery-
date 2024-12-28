import mongoose from "mongoose";


const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
    quantity: { type: Number, default: 1 },
    discount: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData:{type:[cartItemSchema],default:[]}
})

const userModel = mongoose.model.user || mongoose.model("user",userSchema);

export default userModel;