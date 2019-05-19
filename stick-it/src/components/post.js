import React from 'react';
import Draggable from 'react-draggable';
import {Editor, EditorState} from 'draft-js';
import MyEditor from './editable'
import "./css/post.css";
class Post extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  
  render()
  {
      return (
        /*<div className="box effect2"></div>*/
        <Draggable
          axis="both"
          handle=".handle"
          defaultPosition={{x: 0, y: 0}}
          position={null}
          grid={[4, 4]}
          scale={1}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}>
          <div className="box effect2 handle">
            <div className="paper-shadow paper-shadow-top"></div>
            <MyEditor editorState={this.state.editorState} onChange={this.onChange} />
          </div>
        </Draggable>
      );
  }
}

export default Post;