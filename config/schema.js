module.exports = {
  appName: "GENERATOR_API",

  // CONFIG OBJECT 
  config: {
    serverPort: { type: "number" },// example :  8000
    version: { type: "string" },// example :   v1
    networks: {
      type: "array",
      schema: {
        type: "string"
      }
    } // example :   "networks": ["bitcoin","ethereum"]
  },
  // SECRET OBJECT 
  secret: {
    seed: { type: "string" }
  }
};
