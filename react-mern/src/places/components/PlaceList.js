import React from "react";
import styled from "styled-components";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css"
import Button from "../../shared/components/FormElements/Button";
const Card = styled.div`
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 6px;
  padding: 1rem;
  overflow: hidden;
  background: white;
  padding: 1rem;
`;

const PlaceList = (props) => {
  if (props.items.length===0)
    return (
      <div className="place-list center">
        <Card>
          <h2>there is no items, maybe add one ?</h2>
          <Button to="/places/new">ADD ONE</Button>
        </Card>
      </div>
    );
  return (
    <ul className="place-list">
      {props.items.map((item) => <PlaceItem
          key={item.id}
          id={item.id}
          image={item.image}
          title={item.title}
          description={item.description}
          adress={item.adress}
          creatorId={item.creator}
          coordinates={item.location}
          onDelete={props.placeDelete}
        />
      )}
    </ul>
  );
};

export default PlaceList;
