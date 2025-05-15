'use strict';

const config = require("../config");


/**
 * Finds User Address by user Id
 **/
function getAddressByUserId(id) {
  return new Promise((resolve, reject) => {
    let coinAddresses = [];
    let networks = config.get("networks");
    /**
     * Iterate over the networks configured in .GENERATOR_API_Configrc and gets the addresses 
     * to add new networks, 
     * we will only need to create their class logic in networks folder and add the network name in CONFIGrc
     **/
    for (let index in networks) {
      const Network = require(`../networks/${networks[index]}/${networks[index]}`);
      const network = new Network();
      coinAddresses.push(network.getAddressFromSeedByIndex(id));
    }
    Promise.all(coinAddresses)
      .then(data => {
        resolve({
          "userId": parseInt(id),
          "address": data
        })
      }).catch((err) => {
        reject(err);
      })
  })
}

exports.userService = {
  getAddressByUserId
}