/* @flow */

var React = require('react');

var Editor = React.createClass({

  render: function(): ?ReactElement {
    return (
      <div>
        <div contentEditable="true"
             style={{
              maxHeight: 100,
              outline: "none",  // Disable onfocus highlighting
              width: "100%",
              overflowY: "auto"}}
             onInput={this.emitChange}
             onBlur={this.emitChange}>
          Type something here.
        </div>
      </div>
    );
  },

  emitChange: function(event: SyntheticEvent) {
    console.log(event);
  }
});

module.exports = Editor;