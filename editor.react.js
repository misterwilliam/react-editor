/* @flow */

var Rangy = require('rangy');
var RangySelectionSaveRestore = require('rangy/lib/rangy-selectionsaverestore');
var RangyTextRange = require('rangy/lib/rangy-textrange');
var React = require('react');

var sanitizer = require('./sanitizer');


var ContentEditable = React.createClass({

  rangyCursorPosition: null,

  propTypes: {
    sanitizedHtml: React.PropTypes.node.isRequired,
    onChange: React.PropTypes.func,
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.sanitizedHtml !== this.refs.this.innerHTML;
  },

  render: function(): ?ReactElement {
    this.saveCursorPosition();
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
           onBlur={this.emitChange} >
         {/* dangerouslySetInnerHTML={{__html: this.props.sanitizedHtml}}
             is unnecessary because we are doing it manually inside of
             componentDidUpdate */}
      </div>
    )
  },

  componentDidUpdate: function() {
    // React's VDIFF algorithm does not reliably do updates on contenteditable components.
    // So we have to force an update.
    if (this.props.sanitizedHtml !== this.refs.this.innerHTML) {
      this.refs.this.innerHTML = this.props.sanitizedHtml;
    }
    this.restoreCursorPosition();
  },

  saveCursorPosition: function() {
    if (Rangy.initialized) {
      var rangySelection = Rangy.getSelection();
      this.rangyCursorPosition = rangySelection.saveCharacterRanges(this.refs.this);
    }
  },

  restoreCursorPosition: function() {
    if (this.rangyCursorPosition != null) {
      var rangySelection = Rangy.getSelection();
      var innerText = Rangy.innerText(this.refs.this);
      rangySelection.restoreCharacterRanges(this.refs.this, this.rangyCursorPosition);
      this.rangyCursorPosition = null;
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
      sanitizedHtml: "<div></div>",
    }
  },

  render: function(): ?ReactElement {
    return (
      <div className="flex">
        <div className="p1 border">
          <ContentEditable ref="contenteditable"
                           width={600}
                           height={500}
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
            <div className="bold">Presanitized HTML</div>
            <div>
              {this.state.preSanitizedHtml}
            </div>
          </div>
        </div>
      </div>
    );
  },

  handleChange: function(html: string) {
    // Ensure that there is always at least some content inside ContentEditable. Restore
    // cursor position does not work properly if the contenteditable is completely empty.
    if (html.substr(0, 5) != "<div>") {
      html = "<div>"+ html + "</div>";
    }
    this.setState({
      preSanitizedHtml: html,
      sanitizedHtml: sanitizer.Sanitize(html),
    });
  }
});

module.exports = Editor;