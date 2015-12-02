jest.dontMock('htmlparser2');
jest.dontMock('../canonicalizer');

describe('Canonicalizer', function() {
  it('Noop on canonicalized html', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("<div classname=\"content\">hello</div>");
    expect(html).toBe("<div classname=\"content\">hello</div>");
  });
  it('Noop on text', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("hello");
    expect(html).toBe("hello");
  });
  it('Deals with text mixed with divs', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("hello<div>world</div>!");
    expect(html).toBe("hello<div>world</div>!");
  });
  it('collapses redundant divs', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("<div><div>hello</div></div>");
    expect(html).toBe("<div>hello</div>");
  });
  it('collapse logic considers attribs', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize(
      "<div style=\"background:#ccc;\"><div>hello</div></div>");
    expect(html).toBe("<div style=\"background:#ccc;\"><div>hello</div></div>");
  });
  it('No collapse non-redundant divs', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("<div><div>hello</div>world</div>");
    expect(html).toBe("<div><div>hello</div>world</div>");
  });
});