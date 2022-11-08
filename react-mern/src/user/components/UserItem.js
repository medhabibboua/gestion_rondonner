import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Avatar from '../../shared/components/UIElements/Avatar';
import './UserItem.css';

const Card=styled.div`
margin: 0;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
border-radius: 6px;
padding: 1rem;
overflow: hidden;
background: white;
padding:0
`
const UserItem = props => {
  return (
    <li className="user-item">
      <Card>
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
