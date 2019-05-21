'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DraftOffsetKey = require('draft-js/lib/DraftOffsetKey');

var _DraftOffsetKey2 = _interopRequireDefault(_DraftOffsetKey);

var _draftJsButtons = require('draft-js-buttons');

var _BlockTypeSelect = require('../BlockTypeSelect');

var _BlockTypeSelect2 = _interopRequireDefault(_BlockTypeSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable react/no-array-index-key */


var Toolbar = function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  function Toolbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Toolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      position: {
        transform: 'scale(0)'
      }
    }, _this.onEditorStateChange = function (editorState) {
      var selection = editorState.getSelection();
      if (!selection.getHasFocus()) {
        _this.setState({
          position: {
            transform: 'scale(0)'
          }
        });
        return;
      }

      var currentContent = editorState.getCurrentContent();
      var currentBlock = currentContent.getBlockForKey(selection.getStartKey());
      // TODO verify that always a key-0-0 exists
      var offsetKey = _DraftOffsetKey2.default.encode(currentBlock.getKey(), 0, 0);
      // Note: need to wait on tick to make sure the DOM node has been create by Draft.js
      setTimeout(function () {
        var node = document.querySelectorAll('[data-offset-key="' + offsetKey + '"]')[0];

        // The editor root should be two levels above the node from
        // `getEditorRef`. In case this changes in the future, we
        // attempt to find the node dynamically by traversing upwards.
        var editorRef = _this.props.store.getItem('getEditorRef')();
        if (!editorRef) return;

        // this keeps backwards-compatibility with react 15
        var editorRoot = editorRef.refs && editorRef.refs.editor ? editorRef.refs.editor : editorRef.editor;
        while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
          editorRoot = editorRoot.parentNode;
        }

        var position = {
          top: node.offsetTop + editorRoot.offsetTop,
          transform: 'scale(1)',
          transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)'
        };
        // TODO: remove the hard code(width for the hover element)
        if (_this.props.position === 'right') {
          // eslint-disable-next-line no-mixed-operators
          position.left = editorRoot.offsetLeft + editorRoot.offsetWidth + 80 - 36;
        } else {
          position.left = editorRoot.offsetLeft - 80;
        }

        _this.setState({
          position: position
        });
      }, 0);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Toolbar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.store.subscribeToItem('editorState', this.onEditorStateChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.store.unsubscribeFromItem('editorState', this.onEditorStateChange);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          theme = _props.theme,
          store = _props.store;


      return _react2.default.createElement(
        'div',
        {
          className: theme.toolbarStyles.wrapper,
          style: this.state.position
        },
        _react2.default.createElement(
          _BlockTypeSelect2.default,
          {
            getEditorState: store.getItem('getEditorState'),
            setEditorState: store.getItem('setEditorState'),
            theme: theme
          },
          this.props.children
        )
      );
    }
  }]);

  return Toolbar;
}(_react2.default.Component);

Toolbar.defaultProps = {
  children: function children(externalProps) {
    return (
      // may be use React.Fragment instead of div to improve perfomance after React 16
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_draftJsButtons.HeadlineOneButton, externalProps),
        _react2.default.createElement(_draftJsButtons.HeadlineTwoButton, externalProps),
        _react2.default.createElement(_draftJsButtons.BlockquoteButton, externalProps),
        _react2.default.createElement(_draftJsButtons.CodeBlockButton, externalProps),
        _react2.default.createElement(_draftJsButtons.UnorderedListButton, externalProps),
        _react2.default.createElement(_draftJsButtons.OrderedListButton, externalProps)
      )
    );
  }
};


Toolbar.propTypes = {
  children: _propTypes2.default.func
};

exports.default = Toolbar;