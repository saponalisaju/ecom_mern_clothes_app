import React from "react";
import PropTypes from "prop-types";
import "./Breadcrumb.css";
import arrow_icon from "../Assets/breadcrumb_arrow.png";

const Breadcrumb = (props) => {
  const { product } = props;
  return (
    <div className="breadcrumb">
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" />
      {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  );
};

Breadcrumb.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Breadcrumb;
