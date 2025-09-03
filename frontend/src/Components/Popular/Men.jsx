import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Item from "../Items/Item";
import Spinner from "react-bootstrap/esm/Spinner";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Men = () => {
  const [popularMen, setPopularMen] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`product/popular_men`, {
        timeout: 5000,
      });
      console.log("Men", response);
      setPopularMen(response?.data);
    } catch (error) {
      setError("Failed to fetch men collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    // Save to cart (example using localStorage)
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    console.log("Added to cart:", product);
    navigate("/cart");
  };

  return (
    <div className="popular">
      <h1>POPULAR IN MEN</h1>
      <hr />
      {loading ? (
        <p className="text-center mt-3">
          <Spinner animation="border" variant="primary" />
        </p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="popular-item">
          {popularMen.map((item, i) => {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                onClick={() => handleAddToCart(item)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Men;
