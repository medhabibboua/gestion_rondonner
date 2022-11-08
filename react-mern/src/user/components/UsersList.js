import React from 'react';
import styledComponents from 'styled-components';

import UserItem from './UserItem';
import './UsersList.css';

const Card=styledComponents.div`
margin: 0;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
border-radius: 6px;
padding: 1rem;
overflow: hidden;
background: white;
padding:0
`
const UsersList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
        <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
