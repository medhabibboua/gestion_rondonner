import React, { useEffect, useState } from "react";
import axios from "axios";

import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpHook } from "../../shared/hooks/http-hook";

const Users = () => {
  const [loadedUser, setLoadedUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  useEffect(() => {
    const handleRequest = async () => {
      try {
        const responseData = await sendRequest("http://localhost:5000/api/users");
        setLoadedUser(responseData.users);
      } catch (err) {
        console.log(err);
      }
    };
    handleRequest();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUser && <UsersList items={loadedUser} />}
    </React.Fragment>
  );
};

export default Users;
