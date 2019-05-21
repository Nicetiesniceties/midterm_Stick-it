/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { ContentState, EditorState, RichUtils, convertToRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';
import editorStyles from './css/editorStyles.css';
import { init } from 'events';



/*const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];*/
export default class Edit extends Component {
    constructor(props) {
        super(props);
        var inlineToolbarPlugin = createInlineToolbarPlugin();
        var plugins = [inlineToolbarPlugin];
        this.state = {
            editorState: createEditorStateWithText(props.text),
            plugins: plugins,
            toolbar: inlineToolbarPlugin,
        };
    }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };
  render() {
    const { InlineToolbar } = this.state.toolbar;
    return (
      <div onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={this.state.plugins}
          ref={(element) => { this.editor = element; }}
        />
        <InlineToolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </div>
            )
          }
        </InlineToolbar>
      </div>
    );
  }
}