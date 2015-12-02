var babel = require("babel-core");

module.exports = {
  process: function (src, filename) {
    // Ignore all files within node_modules
    if (filename.indexOf("node_modules") === -1) {
      src = babel.transform(src, {
        filename: filename,
        retainLines: true,
        auxiliaryCommentBefore: "istanbul ignore next",
        presets: ['react']
      }).code;
      return babel.transform(src, {
        filename: filename,
        retainLines: true,
        auxiliaryCommentBefore: "istanbul ignore next",
        presets: ['es2015']
      }).code;
    }

    return src;
  }
};