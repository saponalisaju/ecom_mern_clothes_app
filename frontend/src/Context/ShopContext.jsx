import React, { createContext, useEffect, useMemo, useState } from "react";
import api from "../Components/api";
import PropTypes from "prop-types";

export const ShopContext = createContext(null);

// const getDefaultCart = () => {
//   let cart = {};
//   for (let index = 0; index < 301; index++) {
//     cart[index] = 0;
//   }
//   return cart;
// };

const getDefaultCart = () => ({});

const ShopContextProvider = (props) => {
  const [allProduct, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/all_products");
        setAllProduct(response.data);
        console.log("all", response);
      } catch (error) {
        console.error("Error fetching all products", error);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await api.post("/users/get_cart", { timeout: 5000 });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };

    fetchProducts();

    if (localStorage.getItem("auth-token")) {
      fetchCart();
    }
  }, []);

  const addToCart = async (itemId) => {
    try {
      const response = await api.post("/users/add_to_cart", {
        timeout: 5000,
        data: { itemId },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });

    if (localStorage.getItem("auth-token")) {
      try {
        const response = await api.post(
          "users/remove_from_cart",
          { itemId },
          { timeout: 5000 }
        );
        if (response.data) {
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("Error removing item from cart", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = allProduct.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  // const contextValue = {
  //   getTotalCartItems,
  //   getTotalCartAmount,
  //   allProduct,
  //   cartItems,
  //   addToCart,
  //   removeFromCart,
  // };

  const contextValue = useMemo(
    () => ({
      getTotalCartItems,
      getTotalCartAmount,
      allProduct,
      cartItems,
      addToCart,
      removeFromCart,
    }),
    [allProduct, cartItems]
  );

  ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
