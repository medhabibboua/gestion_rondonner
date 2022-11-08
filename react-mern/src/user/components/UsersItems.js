import React from "react";
import Avatar from "../../shared/components/UIElements/Avatar"
const UsersItem = (props) => {
  return (
    <div>
        <h1>{props.name}</h1>
      <Avatar image={props.image} alt={props.name} />
      <h3>{props.placeCount} {props.placeCount===1? "place":"places"}</h3>
    </div>
  );
};

export default UsersItem;
