import React from 'react';
import "./css/add.css";
class Add extends React.Component  {
  render()
  {
      return (
        <div class="add-button">
          <div class="sub-button tl"></div>
          <div class="sub-button tr"></div>
          <div class="sub-button bl"></div>
          <div class="sub-button br"></div>
        </div>
      );
  }
}
export default Add;