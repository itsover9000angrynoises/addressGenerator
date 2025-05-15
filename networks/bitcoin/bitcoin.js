let { BIP32Factory } = require('bip32');
let ecc = require('tiny-secp256k1');
let bip39 = require('bip39');
let bitcoin = require('bitcoinjs-lib');
let bip32 = BIP32Factory(ecc);
const config = require('../../config');

class Bitcoin {
    constructor() {

    }

    /**
     * Finds bitcoin legacy Address from a configured bip39 seed for a account
    **/
    getAddressFromSeedByIndex(index) {
        return new Promise((resolve, reject) => {
            try {
                const seed = bip39.mnemonicToSeedSync(config.getSecret("seed"));
                const root = bip32.fromSeed(seed);
                const path = `m/44'/0'/${index}'/0/0`;
                const wallet = root.derivePath(path);
                const { address } = bitcoin.payments.p2pkh({
                    pubkey: wallet.publicKey,
                    network: bitcoin.networks.bitcoin,
                });
                resolve({
                    "network": "Bitcoin",
                    "coinSymbol": "BTC",
                    address,
                    "publicKey": wallet.publicKey.toString('hex'),
                    "privateKey": wallet.toBase58()
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    /**
    * Finds bitcoin Address from fireblocks provider for a account
    **/
    getAddressFromFireblocksById(Id) {
    }

    /**
    * Finds bitcoin Address from Bitgo provider for a account
    **/
    getAddressFromBitgoById(index) {
    }
}

module.exports = Bitcoin