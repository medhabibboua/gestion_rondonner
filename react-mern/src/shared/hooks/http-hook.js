import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

export const useHttpHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      setError(null);
      const httpAbrotContrll = new AbortController();
      activeHttpRequest.current.push(httpAbrotContrll);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbrotContrll.signal,
        });
        activeHttpRequest.current = activeHttpRequest.current.filter(
          (httpReq) => httpReq !== httpAbrotContrll
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        };
        setIsLoading(false)
        return responseData;
      } catch (err) {

        setIsLoading(false);
        setError(err.message);
        throw err;
      }
      
    },[]);
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((httpReq) => httpReq.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

/*
//with axios:
import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

export const useHttpHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (method = "get", url, body = null) => {
    setIsLoading(true);
    setError(null);
    try {
      setIsLoading(true);
      const source = axios.CancelToken.source();
      activeHttpRequest.current.push(source);
      const response = await axios({ method, url, body, cancelToken: source.token });
      const responseData = response.data;
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);
      return responseData;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      throw err
    }
  }, []);
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((source) =>
        source.cancel("axios request cancelled")
      );
    };
  }, []);
  
  return { isLoading, error, sendRequest, clearError };
};


*/
