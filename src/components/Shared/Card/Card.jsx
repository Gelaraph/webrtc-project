/* eslint-disable react/prop-types */
import "./Card.css";

const Card = (props) => {
  return <div className="card">{props.children}</div>;
};

export default Card;
