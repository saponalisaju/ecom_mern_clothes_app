import React from "react";
import PropTypes from "prop-types";
import "./Item.css";

const Item = ({ id, name, image, new_price, old_price, onClick }) => {
  return (
    <div className="item" key={id} onClick={onClick}>
      <img src={image} alt={name} className="item-image" />
      <div className="item-details">
        <h3 className="item-name">{name}</h3>
        <p className="item-price">
          <span className="new-price">${new_price}</span>
          {old_price && <span className="old-price">${old_price}</span>}
        </p>
      </div>
    </div>
  );
};

Item.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  new_price: PropTypes.number,
  old_price: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};
export default Item;
