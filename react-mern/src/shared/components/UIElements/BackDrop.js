import React from 'react';
import ReactDOM from 'react-dom';
import "./backdrop.css"

const BackDrop = (props) => {
    const content=<div className='backdrop' onClick={props.onClick} ></div>
  return (ReactDOM.createPortal(content,document.getElementById("back-drawer"))
    
  )
}

export default BackDrop