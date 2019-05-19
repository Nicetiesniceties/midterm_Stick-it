import React from 'react';
import Post from '../components/post';
class Bulletin extends React.Component  {

  render()
  {
      return (
       <div>
           <Post/>
           <Post/>
       </div>
      );
  }
}

export default Bulletin;