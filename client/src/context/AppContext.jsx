import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export const AppContext = createContext(null);

const AppContextProvider = (props) => {

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [category, setCategory] = useState("All");
    const [food_list, setFood_List] = useState([]);
    const [displayFood, setDisplayFood] = useState(food_list);
    const [cartItems, setCartItems] = useState([]);
    const [addingStates, setAddingStates] = useState({})
    const [cartOpen, setCartOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [totalQuantity, setTotalQuantity] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const isUserAvailable = localStorage.getItem('token');
        if (isUserAvailable) {
            setToken(isUserAvailable);
            loadCartData()
        }
    }, [token])

    const loadCartData = async () => {
        try {
            if (token) {
                const { data } = await axios.get(backendUrl + '/api/cart/getCart', { headers: { token } });
                setCartItems(data.cartData);
            }
        } catch (error) {
            console.log("error in loadcart data ", error);
        }
    }

    const loadFoods = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/food/get-food");
            setFood_List(data.foods);
            setDisplayFood(data.foods)
        } catch (error) {
            console.log("error in fetching food list ", error)
        }
    }

    useEffect(() => {
        loadFoods();
    }, [])


    const getTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }
    const getTotalAmount = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.discount, 0);
    }
    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            navigate("/")
            setToken(null);
            setCartItems([]);
        } catch (error) {
            console.log(error.message);
        }
    }


    useEffect(() => {
        const newTotal = getTotalQuantity(cartItems);
        setTotalQuantity(newTotal);
        const TotalPrice = getTotalAmount(cartItems);
        setTotalAmount(TotalPrice)
    }, [cartItems])


    const addToCart = async (product) => {
        setAddingStates((prev => ({ ...prev, [product._id]: true })))
        try {
            const response = await axios.post(backendUrl + "/api/cart/add", { id: product._id }, { headers: { token } })
            setCartItems(response.data.cartData);
        } catch (error) {
            setShowLogin(true)
        }
        setInterval(() => {
            setAddingStates((prev => ({ ...prev, [product._id]: false })))
        }, 500);
    }

    const removeFromCart = async (product) => {
        try {
            const reponse = await axios.post(backendUrl + "/api/cart/removeItem", { id: product.productId }, { headers: { token } });
            if (reponse.data.success) {
                setCartItems(reponse.data.cartData);
            }
        } catch (error) {
            console.log("error in removefromcart");
        }
    }

    const categorise = (category) => {
        if (category === "All") {
            setCategory("All");
            setDisplayFood(food_list)
        } else {
            const items = food_list.filter((item) => item.category == `${category}`);
            setCategory(category);
            setDisplayFood(items);
        }
        setCurrPage(1);
    }



    const value = {
        category, setCategory, displayFood, setDisplayFood, categorise, addToCart, removeFromCart, cartItems, setCartItems,
        cartOpen, setCartOpen, addingStates, totalQuantity, totalAmount, showLogin, setShowLogin, setShowMobileMenu, showMobileMenu,
        backendUrl, token, setToken, logout, food_list
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;

