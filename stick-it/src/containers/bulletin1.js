import React from 'react';
import Post from '../components/post1';
import "../components/css/post.css"
import "../components/css/add.css"
import "./css/bulletin.css"
class Bulletin extends React.Component  {
  constructor(props) {
    super(props);
    this.index_handler = this.index_handler.bind(this)
    this.state = {
      post_list: [
        {color: "orange", text: "", x: 100, y: 100, w: 300, h: 300},
        {color: "#ff4081", text: "", x: 800, y: 100, w: 300, h: 300},
        {color: "greenyellow", text: "", x: 100, y: 600, w: 300, h: 300},
        {color: "rgb(0, 195, 255)", text: "", x: 800, y: 600, w: 300, h: 300}
      ],
      zIndex_num: 4,
    };
  }
  index_handler = () => {
    const old_num = this.state.zIndex_num;
    this.setState({
      zIndex_num: old_num + 1,
    })
  }
  handleClick = (colorname) => {
    const old_post = this.state.post_list ;
    const new_post = old_post.concat({color: colorname, text: "", x: 800, y: 100});
    const old_num = this.state.zIndex_num;
    this.setState({post_list: new_post, zIndex_num: old_num + 1});
  };
  render()
  {
 
      return (
       <div className="background">

          {this.state.post_list.map(
            e => <Post color={e.color} text={e.text} x={e.x} y={e.y} w={e.w} h={e.h} index_handler = {this.index_handler} index_num = {this.state.zIndex_num}/>
            )}
          <div className="add-button" onClick = {() => this.handleClick("orange")}></div>
       </div>
      );
  }
}
export default Bulletin;