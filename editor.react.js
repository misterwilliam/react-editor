/* @flow */

var React = require('react');

var sanitizer = require('./sanitizer');

var ContentEditable = React.createClass({

  propTypes: {
    sanitizedHtml: React.PropTypes.node.isRequired,
    onChange: React.PropTypes.func,
  },

  // Never update automatically. Editor component completely controls when to update this
  // component.
  shouldComponentUpdate: function() {
    return false;
  },

  render: function(): ?ReactElement {
    return (
      <div ref="this"
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
    if (this.props.sanitizedHtml !== this.refs.this.innerHTML) {
      this.refs.this.innerHTML = this.props.sanitizedHtml;
    }
  },

  emitChange: function(event: SyntheticEvent) {
    var html = this.refs.this.innerHTML;
    if (this.props.onChange) {
      this.props.onChange(html);
    }
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
      <div className="flex border">
        <ContentEditable ref="contenteditable"
                         sanitizedHtml={this.state.sanitizedHtml}
                         onChange={this.handleChange} />
        <div className="border"
             style={{
                width: 400,
                maxWidth: 400,
              }}>
          <div className="h1 bold">Debug Panel</div>
          Data: {this.state.sanitizedHtml}
        </div>
      </div>
    );
  },

  handleChange: function(html: Object) {
    this.setState({
      sanitizedHtml: sanitizer.Sanitize(html),
    });
    this.refs.contenteditable.forceUpdate();
  }
});

module.exports = Editor;