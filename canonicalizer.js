/* @flow */
"use strict";

var _ = require('lodash');
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
    var result = "<" + this.tagname + this.attribsToString() + ">";
    for (var i = 0; i < this.childNodes.length; i++) {
      result += this.childNodes[i].toString();
    }
    result += "</" + this.tagname + ">";
    return result;
  }

  attribsToString(): string {
    var result = "";
    _.forEach(this.attribs, (value, key) => {
      result += " " + key + "=\"" + value + "\"";
    })
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

function GetSoleChild(node: Node): ?Node {
  if (node.childNodes.length == 1) {
    return node.childNodes[0];
  }
  return null;
}

function MaybeCollapseNode(node: Node) {
  var soleChild = GetSoleChild(node);
  if (soleChild != null) {
    if (node instanceof ElementNode &&
        soleChild instanceof ElementNode) {
      var matchingTag = node.tagname === soleChild.tagname;
      var matchingAttribs = _.isEqual(node.attribs, soleChild.attribs);
      if (matchingTag && matchingAttribs) {
        CollapseNode(node);
      }
    }
  }
}

function CollapseNode(node: Node) {
  node.childNodes = node.childNodes[0].childNodes;
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
      MaybeCollapseNode(node);
    },
    onend: function() {
      var node = stack.pop();
      MaybeCollapseNode(node);
      result = node.toString();
    }
  }, {decodeEntities: true});
  parser.write(html);
  parser.end();

  return result;
}
module.exports.Canonicalize = Canonicalize;