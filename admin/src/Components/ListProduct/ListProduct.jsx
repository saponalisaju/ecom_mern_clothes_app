import { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import api from "../api";

const ListProduct = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/product/all_products", {
          timeout: 5000,
        });
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    await api.delete(`/product/remove_product/${id}`, {
      timeout: 5000,
    });
  };

  return (
    <div className="list-product">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => (
          <div
            key={product.id || index}
            className="listproduct-format-main listproduct-format"
          >
            <img
              src={product.image}
              alt=""
              className="listproduct-product-icon"
            />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img
              onClick={() => {
                remove_product(product.id);
              }}
              className="listproduct-remove-icon"
              src={cross_icon}
              alt=""
            />
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
