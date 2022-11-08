import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPlace.css";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useFrom } from "../../shared/hooks/Form-hook";
import { useHttpHook } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const navigate=useNavigate()
  const [formState, InputHandler] = useFrom(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      adress: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  const { userId } = useContext(AuthContext);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("adress", formState.inputs.adress.value);
      formData.append("creator", userId);
      formData.append("image", formState.inputs.image.value);
      await sendRequest("http://localhost:5000/api/places", "POST", formData);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <form className="place-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner isOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid title"
          onInput={InputHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="textarea"
          label="Description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText="please enter a valid description"
          onInput={InputHandler}
        />
        <Input
          id="adress"
          element="input"
          type="text"
          label="Adress"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid adress"
          onInput={InputHandler}
        />
        <ImageUpload id="image" onInput={InputHandler} />
        <Button type="submit" disabled={!formState.isValid}>
          add place
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
