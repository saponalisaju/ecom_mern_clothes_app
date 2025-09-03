import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Item from "../Items/Item";
import Spinner from "react-bootstrap/esm/Spinner";

const Men = () => {
  const [popularMen, setPopularMen] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`product/popular_men`, {
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
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Men;
