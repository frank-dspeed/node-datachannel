// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeDataChannel = require('../build/Release/node_datachannel.node');
const DataChannelStream = require('./datachannel-stream');
module.exports = { nodeDataChannel, DataChannelStream };
