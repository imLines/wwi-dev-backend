const nodeCache = require('node-cache');

const appCache = new nodeCache({stdTTL: 10});

module.exports = appCache;