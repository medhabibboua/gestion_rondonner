import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpHook } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UserPlaces = (props) => {
  const { isLoading,error,sendRequest,clearError } = useHttpHook();
  const { userId } = useParams();
  const [userPlaces, setUserPlaces] = useState();
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setUserPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [userId, sendRequest]);

  const placeDeleteHandler=(dpid)=>{
    setUserPlaces(prevState=>prevState.filter(place=>place.id!==dpid))
  }

  return (
    <React.Fragment>
    {isLoading && <LoadingSpinner isOverlay/>}
    <ErrorModal error={error} onClear={clearError} />
    {!isLoading && userPlaces && <PlaceList items={userPlaces} placeDelete={placeDeleteHandler}/>}
    </React.Fragment>
  );
};

export default UserPlaces;
