/* @flow */

var Rangy = require('rangy');

var RangyTextRange = require('rangy/lib/rangy-textrange');
var React = require('react');

// Implements a contenteditable div as a React component. Contents of the div are passed
// in through props.sanitizedHtml. Cursor position saving does not work correctly if the
// contents passed in are not wrapped in a div.

// Implementation notes: We need to save the cursor position because after the contents
// are updated in the render function the cursor position is lost. So we need to save and
// restore it. Cursor position saving is accomplished by using Rangy's innerText offset
// based cursor position saving. innerText is a non-standard Node property that roughly
// translates to the text on the screen stripped of formatting. We need to save the cursor
// position by saving the innerText offset because after onChange emits changes it is can
// be mutated by sanitization and canonicalization before being repassed in through props.

var ContentEditable = React.createClass({

  rangyCursorPosition: null,

  propTypes: {
    sanitizedHtml: React.PropTypes.node.isRequired,
    onChange: React.PropTypes.func,
  },

  shouldComponentUpdate: function(nextProps: Object, nextState: Object): bool {
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

module.exports = ContentEditable;