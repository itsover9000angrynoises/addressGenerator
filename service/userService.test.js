const { userService } = require('./userService');
const config = require("../config");
const bitcoin = require('../networks/bitcoin/bitcoin');

test('gets user address where id is 1', async () => {
    config.get = jest.fn((key) => []);
    expect(await userService.getAddressByUserId(1)).toMatchObject({
        userId: 1,
        address: []
    });
    config.get.mockRestore();
});

test('networks throws Error', async () => {
    let expected = "Expected UInt31, got Number 429496729"
    config.get = jest.fn((key) => ['bitcoin']);
    jest.spyOn(bitcoin.prototype, 'getAddressFromSeedByIndex').mockImplementation((index) => { throw  Error(expected) })
    try {
        await userService.getAddressByUserId(429496729);
    } catch (err) {
        expect(err.message).toBe(expected);
    }
});