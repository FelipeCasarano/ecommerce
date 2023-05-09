import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const initialCart = [];
    const initialQuantity = 0;
    const [cartItems, setCartItems] = useState(initialCart);
    const [totalQuantities, setTotalQuantities] = useState(initialQuantity);
    const [showCart, setShowCart] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);

    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    /** This will persist the cart items **/

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cart'));
        if (cartData) {
            setCartItems(cartData);
        }
    }, []);

    useEffect(() => {
        if (cartItems !== initialCart) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    /** This will persist the quantity **/

    useEffect(() => {
        const cartQuantity = JSON.parse(localStorage.getItem('quantity'));
        if (cartQuantity) {
            setTotalQuantities(cartQuantity);
        }
    }, []);

    useEffect(() => {
        if (totalQuantities !== initialQuantity) {
            localStorage.setItem('quantity', JSON.stringify(totalQuantities));
        }
    }, [totalQuantities]);


    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);


        if (checkProductInCart) {


            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems);
            toast.success(`${qty} ${product.name} added to the cart.`);
        } else {
            product.quantity = quantity;

            setCartItems([...cartItems, { ...product }]);
        }




    }
    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    }

    const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id)

        if (value === 'inc') {
            setCartItems(prevCartItems =>
                prevCartItems.map(item => {
                    if (item._id === id) {
                        return { ...item, quantity: foundProduct.quantity + 1 }
                    }
                    return item
                })
            );
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems(prevCartItems =>
                    prevCartItems.map(item => {
                        if (item._id === id) {
                            return { ...item, quantity: foundProduct.quantity - 1 }
                        }
                        return item
                    })
                );
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }


    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuanitity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities

            }}>

            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);