const Ethereum = require('./ethereum');
const config = require('../../config');
const Wallet = require('ethereumjs-wallet').default

beforeAll(() => {
  config.getSecret = jest.fn((key) => { return "loud speak raise fork ready lazy tiny spot demise citizen switch chief" });
});

test('gets user address where id is 1', async () => {
  const ethereum = new Ethereum()
  expect(await ethereum.getAddressFromSeedByIndex(1)).toMatchObject({
    "network": "Ethereum",
    "coinSymbol": "ETH",
    "address": "0x3b106dc014cb4cf42ce81756adae25b823f3f863",
    "publicKey": "0x997070a4ff9370938b06301a8cb4700a65cad2343c46aaaf7532d34a8e864ee37745c7e9af8aa086ff8964dec99efc48e6610541d3c9b402370786f827f8843a",
    "privateKey": "0x3866adafcb95c0e648d6266c527c6584fd74fcc3adfdd81e3b826764b4cba7e0"
  });
});


test('test correctness of the keys generated with userId 1', async () => {
  const ethereum = new Ethereum()
  let response = await ethereum.getAddressFromSeedByIndex(1)
  const wallet = Wallet.fromPrivateKey(
    Buffer.from(response.privateKey.slice(2,response.privateKey.length),'hex') // remove 0x from private key
    )
  expect(response.address).toBe(wallet.getAddressString());
  expect(response.publicKey).toBe(wallet.getPublicKeyString())
});

test('throws Error when userId is large number', async () => {
  const ethereum = new Ethereum()
  try {
    await ethereum.getAddressFromSeedByIndex(4294967295)
  } catch (err) {
    expect(err.message).toBe("Invalid index");
  }
});