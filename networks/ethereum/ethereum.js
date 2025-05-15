const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet')
const config = require('../../config');

class Ethereum {
    constructor() {

    }


    /**
     * Finds Ethereum Address from a configured bip39 seed for a account
    **/
    getAddressFromSeedByIndex(index) {
        return new Promise((resolve, reject) => {
            try {
                const hdWallet = hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(config.getSecret("seed")));
                const path = `m/44'/0'/${index}'/0/0`;
                const wallet = hdWallet.derivePath(path).getWallet();
                const address = `0x${wallet.getAddress().toString('hex')}`;
                resolve({
                    "network": "Ethereum",
                    "coinSymbol": "ETH",
                    address,
                    "publicKey": wallet.getPublicKeyString(),
                    "privateKey": wallet.getPrivateKeyString()
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    /**
    * Finds Ethereum Address from fireblocks provider for a account
    **/
       getAddressFromFireblocksById(Id) {
    }

    /**
    * Finds Ethereum Address from Bitgo provider for a account
    **/
    getAddressFromBitgoById(index) {
    }
}

module.exports = Ethereum