/* @flow */

var React = require('react');
var ReactDOM = require('react-dom');
// Globally load basscss into this project
// $FlowIgnore: Flow can't find this module
var basscss = require('basscss/css/basscss.css');

var Editor = require('./editor.react');

var App = React.createClass({

  render: function() {
    return (
      <div className="m4">
        <h1>A Very Nice Editor</h1>
        <div>
          <Editor />
        </div>
      </div>
    )
  }
});

ReactDOM.render(
  <App />, document.getElementById('react-container')
);