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
             outline: "none",  // Disable onfocus highlighting
             width: this.props.width,
             height: this.props.height,
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
      <div className="flex">
        <div className="p1 border">
          <ContentEditable ref="contenteditable"
                           width={600}
                           height={800}
                           sanitizedHtml={this.state.sanitizedHtml}
                           onChange={this.handleChange} />
        </div>
        <div className="ml4 flex flex-column">
          <div className="h1 bold">Debug Panel</div>
          <div className="flex-auto p1 border"
               style={{
                width: 400,
                fontFamily: "courier, monospace",
                fontSize: 12,
               }}>
            <div className="bold">Data</div>
            <div>
              {this.state.sanitizedHtml}
            </div>
          </div>
        </div>
      </div>
    );
  },

  handleChange: function(html: string) {
    this.setState({
      sanitizedHtml: sanitizer.Sanitize(html),
    });
    this.refs.contenteditable.forceUpdate();
  }
});

module.exports = Editor;