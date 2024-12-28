import foodModel from "../models/FoodModel.js";
import userModel from "../models/userModel.js"

export const addToCart = async (req, res) => {
    try {

        const userData = await userModel.findById(req.user);
        const { id: productId } = req.body;

        const product = await foodModel.findById(productId)

        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        const cartData = userData.cartData;

        const existingItemIndex = cartData.findIndex(item => item.productId.toString() === product._id.toString());

        if (existingItemIndex !== -1) {
            cartData[existingItemIndex].quantity += 1;
        } else {
            cartData.push({
                productId: product._id,
                name: product.name,
                image: product.image,
                discount: product.discount,
                quantity: 1,
            });
        }

        userData.cartData = cartData;
        await userData.save()

        return res.json({ success: true, cartData: userData.cartData });

    } catch (error) {
        console.log("error in addTocart ", error);
    }
}

export const removeFromCart = async (req, res) => {
    try {

        const userData = await userModel.findById(req.user);
        const { id: productId } = req.body;

        const product = await foodModel.findById(productId)

        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        const cartData = userData.cartData;

        const existingItemIndex = cartData.findIndex(item => item.productId.toString() === product._id.toString());

        if (existingItemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not found in the cart" });
        }
        if (cartData[existingItemIndex].quantity > 1) {
            cartData[existingItemIndex].quantity -= 1;
        }

        userData.cartData = cartData;
        await userData.save()

        return res.json({ success: true, cartData: userData.cartData });


    } catch (error) {
        console.log("error in addTocart ", error);
    }
}

export const removeItem = async (req, res) => {
    try {
        const userId = req.user;
        const { id: productId } = req.body;

        if (!productId) {
            return res.json({ success: false });
        }
        const result = await userModel.updateOne(
            { _id: userId, "cartData.productId": productId },
            { $pull: { cartData: { productId: productId } } }
        )
        if (result.modifiedCount === 0) {
            return res.json({ success: false });
        }

        const updatedUser = await userModel.findById(userId).select("cartData");
        return res.status(200).json({ success: true, message: "Item removed from cart",cartData:updatedUser.cartData});

    } catch (error) {
        console.log("error in remove cart ", error);
    }
}

export const deletCart = async (req, res) => {
    try {
        const userId = req.user;

        const result = await userModel.updateOne(
            { _id: userId, },
            { $set: { cartData: [] } }
        )

        if (result.modifiedCount === 0) {
            return res.json({ success: false, message: "Item not found" })
        }
        const updatedUser = await userModel.findById(userId)
        return res.status(200).json({ success: true, message: "Item removed from cart", updatedUser });

    } catch (error) {
        console.log("error in remove cart ", error)
        res.json({ success: false })
    }
}

export const getCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.user);
        const cartData = user.cartData;

        res.json({ success: true, cartData: cartData });
    } catch (error) {
        console.log("error in getcart ", error);
        res.json({ success: false, message: error.message });
    }
}