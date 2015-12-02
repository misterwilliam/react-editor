/* @flow */

var React = require('react');

var sanitizer = require('./sanitizer');

var ContentEditable = require('./contenteditable.react');


var Editor = React.createClass({

  getInitialState: function() {
    return {
      preSanitizedHtml: "",
      sanitizedHtml: "<div></div>",
    }
  },

  render: function(): ?ReactElement {
    return (
      <div className="flex">
        <div className="flex flex-column">
          <div className="flex py1">
            <div className="btn btn-outline blue regular">
              H1
            </div>
            <div className="ml1 btn btn-outline blue regular">
              H2
            </div>
            <div className="ml1 btn btn-outline blue regular">
              H3
            </div>
            <div className="flex-auto">{/* spacer */}</div>
            <div className="ml4 btn btn-outline blue">
              Bold
            </div>
            <div className="ml1 btn btn-outline blue regular italic">
              Italic
            </div>
          </div>
          <div className="p1 border">
            <ContentEditable ref="contenteditable"
                             width={600}
                             height={500}
                             sanitizedHtml={this.state.sanitizedHtml}
                             onChange={this.handleChange} />
          </div>
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
  },
});

module.exports = Editor;