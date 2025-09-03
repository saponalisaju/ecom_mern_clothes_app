import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Item from "../Items/Item";
import Spinner from "react-bootstrap/esm/Spinner";
import api from "../api";

const Kid = () => {
  const [popularKid, setPopularKid] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`product/popular_kid`, {
        timeout: 5000,
      });
      console.log("Kid", response);
      setPopularKid(response?.data);
    } catch (error) {
      setError("Failed to fetch kid collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN KID</h1>
      <hr />
      {loading ? (
        <p className="text-center mt-3">
          <Spinner animation="border" variant="primary" />
        </p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="popular-item">
          {popularKid.map((item, i) => {
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

export default Kid;
