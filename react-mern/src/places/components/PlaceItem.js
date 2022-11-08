import React, { useState, useContext } from "react";
import GoogleMapReact from "google-map-react";

import "./PlaceItem.css";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpHook } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
const PlaceItem = (props) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  //google-map-react
  const defaultProps = {
    center: {
      lat: props.coordinates.lat,
      lng: props.coordinates.lng,
    },
    zoom: 11,
  };
  const cancelDeleteHandler = () => {
    setShowDelete(false);
  };
  const confirmDeleteHandler = async () => {
    setShowDelete(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE"
      );
      props.onDelete(props.id)
    } catch (err) {}
  };
  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
      <Modal
        onCancel={() => {
          setShow(false);
        }}
        show={show}
        header={props.title}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <Button
            onClick={() => {
              setShow(false);
            }}
          >
            CLOSE
          </Button>
        }
      >
        <div className="map-container">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyB8_8FKH2a9RbJFcve0OlNexDE7gAag9RM",
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          ></GoogleMapReact>
        </div>
      </Modal>

      <Modal
        show={showDelete}
        onCancel={() => {
          setShowDelete(false);
        }}
        header="Are you sure ?"
        footer={
          <React.Fragment>
            <Button onClick={cancelDeleteHandler} inverse>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>Delete</Button>
          </React.Fragment>
        }
      >
        <p>please make sure because the data c'ant be restored !!</p>
      </Modal>

      <li className="place-item">
      {isLoading && <LoadingSpinner asOverlay/>}
        <div className="place-item__image">
          <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
        </div>
        <div className="place-item__info">
          <h2> {props.title} </h2>
          <h3> {props.adress} </h3>
          <p> {props.description} </p>
        </div>
        <div className="place-item__action">
          <Button
            inverse
            onClick={() => {
              setShow(true);
            }}
          >
            VIEW ON MAP
          </Button>
          {isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>}
          {isLoggedIn && (
            <Button
              danger
              onClick={() => {
                setShowDelete(true);
              }}
            >
              DELETE
            </Button>
          )}
        </div>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
