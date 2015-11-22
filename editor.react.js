/* @flow */

var React = require('react');

var ContentEditable = React.createClass({

  // Never update automatically. Editor component completely controls when to update this
  // component.
  shouldComponentUpdate: function() {
    return false;
  },

  render: function(): ?ReactElement {
    return (
      <div ref="contenteditable"
           contentEditable={true}
           style={{
             maxHeight: 100,
             outline: "none",  // Disable onfocus highlighting
             width: "100%",
             overflowY: "auto"
           }}
           onInput={this.emitChange}
           onBlur={this.emitChange}
           dangerouslySetInnerHTML={{__html: this.props.sanitizedHtml}} >
      </div>
    )
  },

  componentDidUpdate: function() {
    // React's VDIFF algorithm does not reliably do updates on contenteditable components.
    // So we have to force an update.
    if (this.props.sanitizedHtml !== this.refs.contenteditable.innerHTML) {
      this.refs.contenteditable.innerHTML = this.props.sanitizedHtml;
    }
  },

  emitChange: function(event: SyntheticEvent) {
    var html = this.refs.contenteditable.innerHTML;
    this.props.onChange(html)
  }
});

var Editor = React.createClass({

  getInitialState: function() {
    return {
      sanitizedHtml: "",
    }
  },

  render: function(): ?ReactElement {
    return (
      <div>
        <ContentEditable ref="contenteditable"
                         sanitizedHtml={this.state.sanitizedHtml}
                         onChange={this.handleChange} />
        <div>
          Data: {this.state.sanitizedHtml}
        </div>
      </div>
    );
  },

  handleChange: function(html: Object) {
    this.setState({
      sanitizedHtml: html + " derp",
    });
    this.refs.contenteditable.forceUpdate();
  }
});

module.exports = Editor;