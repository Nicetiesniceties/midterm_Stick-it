import React from 'react';
import Draggable from 'react-draggable';
import {Rnd} from 'react-rnd';
import {Editor, EditorState} from 'draft-js';
import MyEditor from './editable'
import "./css/post.css";
import "./css/editorStyles.css"
class Post extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
        x: this.props.x, 
        y: this.props.y, 
        h: this.props.h, 
        w: this.props.w,
        exist: true,
        zIndex: 0,
    };
  }
  onClick = () => {
    this.props.index_handler();
    this.setState({
      zIndex: this.props.index_num,
    })
  };
  close = () => {
    this.setState({
      exist: false,
    })
  }
  render()
  {
      return (

        <Rnd
          size={{ width: this.state.w,  height: this.state.h }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }) }}
          onResize={(e, direction, ref, delta, position) => {
            this.setState({
              w: ref.offsetWidth,
              h: ref.offsetHeight,
              ...position,
            });
          }}
          dragHandleClassName="mhandle"
          resizeHandleStyles="rhandle"
          onClick = {this.onClick}
          style = {{zIndex: this.state.zIndex, display: this.state.exist? "":"none"}}
          >
            <div className="paper" style={{backgroundColor: this.props.color}} >
            <div className="editor_wrap" onClick = {this.onClick}>
              <a href="#" class="close"></a>
              <MyEditor className="editor" text={this.props.text}/>
            </div>
            <div className="mhandle">
            <a href="#" className="close-thick" onClick ={this.close}></a>
            </div>
          </div>
          </Rnd>
      );
  }
}

export default Post;
        /*<div className="box effect2"></div>
        <Draggable
          axis="both"
          handle=".handle"
          defaultPosition={{x: this.props.x, y: this.props.y}}
          position={null}
          grid={[4, 4]}
          scale={1}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}>
          <div className="box effect2" style={{backgroundColor: this.props.color}}>
            <div className="handle"></div>
            <div className="paper-shadow paper-shadow-top"></div>
            <MyEditor className="editor" text={this.props.text}/>
          </div>
        </Draggable>*/