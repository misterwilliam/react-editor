/* @flow */

var React = require('react');
var ReactDOM = require('react-dom');
// Globally load basscss into this project
// $FlowIgnore: Flow can't find this module
var basscss = require('basscss/css/basscss.css');

var App = React.createClass({

  render: function() {
    return (
      <div className="border flex">
        hi
      </div>
    )
  }
});

ReactDOM.render(
  <App />, document.getElementById('react-container')
);