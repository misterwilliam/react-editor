jest.dontMock('../canonicalizer');

describe('Canonicalizer', function() {
 it('Noop on canonicalized html', function() {
   var Canonicalizer = require('../canonicalizer');

   var html = Canonicalizer.Canonicalize("<div>hello</div>");
   expect(html).toBe("<div>hello</div>");
 });
});