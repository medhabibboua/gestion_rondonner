import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams,useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./NewPlace.css";
import Button from "../../shared/components/FormElements/Button";
import { useFrom } from "../../shared/hooks/Form-hook";
import { useHttpHook } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const { placeId } = useParams();
  const [formState, inputHandler, setFormData] = useFrom(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [identifiedPlace, setIdentifeidPlace] = useState();
  const navigate=useNavigate();
  const { userId }=useContext(AuthContext) 
  useEffect(() => {
    const fetchPlaceToUpdate = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setIdentifeidPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaceToUpdate();
  }, [placeId, sendRequest, setFormData]);

  if (isLoading) {
    return <LoadingSpinner isOverlay />;
  }

  if (!identifiedPlace && !error) {
    return <div className="center">no places</div>;
  }


  
  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        { "Content-Type": "application/json" }
      );
      navigate(`/${userId}/places`)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="please enter a valid title"
            onInput={inputHandler}
            value={identifiedPlace.title}
            valid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="description"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
            errorText="please enter a valid title"
            onInput={inputHandler}
            value={identifiedPlace.description}
            valid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            update
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
