/* @flow */

var sanitizeHtml = require('sanitize-html');

var Sanitize = function(dirtyHtml: string) : string {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [ 'br', 'div', 'b', 'i', 'em', 'strong', 'a' ],
    allowedAttributes: {
      'a': [ 'href', 'target' ]
    }
  });
}
module.exports.Sanitize = Sanitize;