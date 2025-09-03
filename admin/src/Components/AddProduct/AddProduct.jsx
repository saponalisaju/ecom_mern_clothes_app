import { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import api from "../api";
import { useNavigate } from "react-router-dom";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddProduct = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileErrors, setFileErrors] = useState({});
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: null,
    category: "women",
    new_price: "",
    old_price: "",
  });

  const validateFile = (file) => {
    const fileType = file.type.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return `Invalid file type. Only JPEG, JPG, and PNG are allowed.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds the limit of 5MB.`;
    }
    return null;
  };

  const changeHandler = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const selectedFile = files[0];
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setFileErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validationError,
        }));
        setProductDetails((prevData) => ({ ...prevData, image: null }));
      } else {
        setFileErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
        setProductDetails((prevData) => ({ ...prevData, image: selectedFile }));
      }
    } else {
      setProductDetails((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const addProductHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, image, category, new_price, old_price } = productDetails;

    try {
      const sendFormData = new FormData();
      sendFormData.append("name", name);
      sendFormData.append("category", category);
      sendFormData.append("new_price", String(new_price));
      sendFormData.append("old_price", String(old_price));

      if (image) {
        sendFormData.append("image", image);
      }

      const response = await api.post("/product/add_product", sendFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 5000,
      });

      if (response?.status === 201) {
        setProductDetails({
          name: "",
          image: null,
          category: "women",
          new_price: "",
          old_price: "",
        });
        alert("Product Added Successfully");
        navigate("/list_product");
      } else {
        setError("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="add-product"
      onSubmit={addProductHandler}
      encType="multipart/form-data"
    >
      <div className="item_field">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="add_product-price">
        <div className="item_field">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="item_field">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="item_field">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="item_field">
        <label htmlFor="file-input">
          <img
            src={
              productDetails.image
                ? URL.createObjectURL(productDetails.image)
                : upload_area
            }
            className="thumbnail-img"
            alt=""
          />
        </label>
        <input
          onChange={changeHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
        {fileErrors.image && <p className="error">{fileErrors.image}</p>}
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="add_product-btn">
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
};

export default AddProduct;
