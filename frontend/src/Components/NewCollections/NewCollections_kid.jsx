import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Items/Item";
import api from "../api";
import Spinner from "react-bootstrap/Spinner";

const NewCollections_kid = () => {
  const [newCollections, setNewCollections] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/product/new_collection_kid`, {
          timeout: 5000,
        });
        console.log("new", response);
        setNewCollections(response?.data);
      } catch (error) {
        setError("Failed to fetch new collections.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="new__collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      {loading ? (
        <div>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="collections">
          {newCollections.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewCollections_kid;
