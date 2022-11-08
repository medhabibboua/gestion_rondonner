import React, { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if(!state.inputs[inputId])
          continue;
          
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else formIsValid = formIsValid && state.inputs[inputId].isValid;
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputData,
        isValid: action.formValidity,
      };
    default:
      return state;
  }
};

export const useFrom = (initialInputs, intialValid) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: intialValid,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({ type: "SET_DATA", inputData, formValidity });
  }, []);

  return [formState, inputHandler, setFormData];
};
