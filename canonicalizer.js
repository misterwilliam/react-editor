/* @flow */
"use strict";

var htmlparser = require("htmlparser2");

class Node {

  childNodes: Array<Node>;

  constructor() {
    this.childNodes = [];
  }

  addChildNode(node: Node) {
    this.childNodes.push(node);
  }

  toString() {
    var result = "";
    for (var i = 0; i < this.childNodes.length; i++) {
      result += this.childNodes[i].toString();
    }
    return result;
  }
};

class ElementNode extends Node {

  tagname: string;
  attribs: Object;

  constructor(tagname: string, attribs: Object) {
    super();
    this.tagname = tagname;
    this.attribs = attribs;
  }

  toString(): string {
    var result = "<" + this.tagname + ">";
    for (var i = 0; i < this.childNodes.length; i++) {
      result += this.childNodes[i].toString();
    }
    result += "</" + this.tagname + ">";
    return result;
  }
}

class TextNode extends Node {

  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  toString(): string {
    return this.text;
  }
}

function CanMergeNodes(parentNode, childNode): bool {
  return parentNode instanceof ElementNode &&
    childNode instanceof ElementNode &&
    parentNode.tagname === childNode.tagname &&
    parentNode.attribs == childNode.attribs;
}

var Canonicalize = function(html: string): string {
  var result = "";
  var stack: Array<Node> = [];
  var rootNode = new Node();
  stack.push(rootNode);
  var parser = new htmlparser.Parser({
    onopentag: function(tagname, attribs) {
      var elementNode = new ElementNode(tagname, attribs);
      stack[stack.length - 1].addChildNode(elementNode);
      stack.push(elementNode);
    },
    ontext: function(text) {
      var textNode = new TextNode(text);
      stack[stack.length - 1].addChildNode(textNode);
    },
    onclosetag: function(tagname) {
      var node = stack.pop();
    },
    onend: function() {
      result = stack.pop().toString();
    }
  }, {decodeEntities: true});
  parser.write(html);
  parser.end();

  return result;
}
module.exports.Canonicalize = Canonicalize;