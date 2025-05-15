const Bitcoin = require('./bitcoin');
const config = require('../../config');
let { BIP32Factory } = require('bip32');
let ecc = require('tiny-secp256k1');
let lib = require('bitcoinjs-lib');
let bip32 = BIP32Factory(ecc);

beforeAll(() => {
  config.getSecret = jest.fn((key) => { return "loud speak raise fork ready lazy tiny spot demise citizen switch chief" });
});

test('gets user address by id', async () => {
  const bitcoin = new Bitcoin()
  expect(await bitcoin.getAddressFromSeedByIndex(1)).toMatchObject({
    "network": "Bitcoin",
    "coinSymbol": "BTC",
    "address": "1FfkAvE9Ar339d9PtJdYN5aPpb3mRuUkRr",
    "publicKey": "02997070a4ff9370938b06301a8cb4700a65cad2343c46aaaf7532d34a8e864ee3",
    "privateKey": "xprvA43ktnRWRW6sVg359f7ufrbeWJKFjy9r4x3YP9gXczveKrn1VBimgScjNMdY516ffcid8tviG3nKorg9Mn171qGgYRfzshdvbwkpus8bCxZ"
  });
});

test('test correctness of the keys generated with userId 1', async () => {
  const bitcoin = new Bitcoin()
  let response = await bitcoin.getAddressFromSeedByIndex(429967295)
  const root = bip32.fromBase58(response.privateKey);
  const { address } = lib.payments.p2pkh({
    pubkey:   root.publicKey,
    network: lib.networks.bitcoin,
  });
  expect(response.address).toBe(address)
  expect(response.publicKey).toBe(root.publicKey.toString('hex'))
});


test('throws Error when userId is large number', async () => {
  const bitcoin = new Bitcoin()
  try {
    await bitcoin.getAddressFromSeedByIndex(4294967295)
  } catch (err) {
    expect(err.message).toBe("Expected UInt31, got Number 4294967295");
  }
});