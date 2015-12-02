jest.dontMock('htmlparser2');
jest.dontMock('../canonicalizer');

describe('Canonicalizer', function() {
  it('Noop on canonicalized html', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("<div>hello</div>");
    expect(html).toBe("<div>hello</div>");
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
  it('Merges redundant divs', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("<div><div>hello</div></div>");
    expect(html).toBe("<div>hello</div>");
  });
  it('No merge non-redundant divs', function() {
    var Canonicalizer = require('../canonicalizer');

    var html = Canonicalizer.Canonicalize("<div><div>hello</div>world</div>");
    expect(html).toBe("<div><div>hello</div>world</div>");
  });
});