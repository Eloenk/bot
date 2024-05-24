// Contains the default configuration for Bot & Plugins
// Any attribute not given in the configuration will take its default value

const botConfig = {
  authFolder: "auth",
  selfReply: false,
  logMessages: true,
};

const pluginsConfig = {
  mirror: {
    prefix: "!mirror!",
  },
  roles: {
    dataFile: "./roles.json",
    prefix: "!role ",
    updateOnAdd: false,
    updateOnRemove: false,
  },
  tagEveryone: {
    membersLimit: 1024,
    trigger: ".tag",
    botta: "2347082282068",
    dem: "2348149702952",
  },
};

module.exports = { botConfig, pluginsConfig };
