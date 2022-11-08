import React, { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useFrom } from "../../shared/hooks/Form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpHook } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload"
const Card = styled.div`
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 6px;
  padding: 1rem;
  overflow: hidden;
  background: white;
  padding: 1rem;
  width: 90%;
  max-width: 25rem;
  margin: 7rem auto;
  text-align: center;
`;

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login,token } = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  const [formState, inputHandler, setFormData] = useFrom(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    let responseData
    if (isLoginMode) {
      try {
         responseData=await sendRequest("http://localhost:5000/api/users/login","POST",JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),{'Content-Type':'application/json'});
        
      } catch (err) {
        console.log(err.message);
      }
      login(responseData.user.id,responseData.token);
     
    } else {
      try {
        const formData=new FormData()
        formData.append("name",formState.inputs.name.value)
        formData.append("email",formState.inputs.email.value)
        formData.append("password",formState.inputs.password.value)
        formData.append("image",formState.inputs.image.value)
        responseData=await sendRequest("http://localhost:5000/api/users/signup","POST", formData,{
          Authorization:'Bearer '+ token
        });
      } catch (err) {
        console.log(err.message);
      }
      login(responseData.user.id,responseData.token);
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined,image:undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevState) => !prevState);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name."
              onInput={inputHandler}
            />
          )}
            {!isLoginMode && <ImageUpload id="image" center onInput={inputHandler} /> }
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
          <Button inverse onClick={switchModeHandler}>
            SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
