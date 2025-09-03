const { serverPort, mongodbURL } = require("../../secret");

const dev = {
  app: {
    port: serverPort,
  },
  db: {
    url: mongodbURL,
  },
};

module.exports = dev;
