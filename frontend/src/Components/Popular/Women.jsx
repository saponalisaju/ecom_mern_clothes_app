import React, { useEffect, useState } from "react";
import "./Women.css";
import Item from "../Items/Item";
import api from "../api";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/product/popular_women`, {
          timeout: 5000,
        });
        console.log("p", response);
        setPopularProducts(response?.data);
      } catch (error) {
        setError("Failed to fetch women data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="popular-item">
          {popularProducts.map((item, i) => {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Popular;
