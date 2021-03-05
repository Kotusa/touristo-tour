const path = require('path'),
  root = path.join(__dirname, '../'),
  src = path.join(root, 'src');
module.exports = {
  root,
  src,
  buildPath: path.join(root, '/src'),
  lighthouse: {
    reportPath: path.join(root, 'reports'),
    PORT: 8080,
    chromeLauncherPort: 9222,
    config: {
      extends: 'lighthouse:default',
    },
    flags: {
      chromeFlags: ['--show-paint-rects'],
      output: 'html',
    },
  },
};
