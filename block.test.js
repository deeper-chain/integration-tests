const { createApi } = require('./client');
const { Keyring } = require('@polkadot/api');
const { hexToU8a, isHex, hexToBigInt } = require('@polkadot/util');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

const DPR = Math.pow(10, 18); // 18 decimals
const ONE_BILLION = 1000000000;

// afterAll(async () => {
//     await api.disconnect();
// });

// test("should produce new blocks", async () => {
//     const block1 = await api.rpc.chain.getBlock();
//     expect(block1.block.header.number.toNumber()).toBeGreaterThan(0);
// });

function DPRToAtom(amt) {
    return BigInt(parseInt(amt * ONE_BILLION)) * BigInt(DPR / ONE_BILLION);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
beforeAll(async () => {
    api = await createApi();
    await cryptoWaitReady();
});

describe('Any account can receive balance', () => {
    test("root can clear old balance", async () => {
        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');
        await api.tx.sudo.sudo(api.tx.balances.setBalance('5Do5y4d8KBQcGHwgd9k7fh1fj3ra5twoayMEgyo6otkV4kzq', 0, 0)).signAndSend(alice);

        await delay(6000);

        const { nonce, data: balance } = await api.query.system.account('5Do5y4d8KBQcGHwgd9k7fh1fj3ra5twoayMEgyo6otkV4kzq');
        const free = BigInt(parseInt(balance.free.toString()));
        expect(free).toBe(BigInt(0));
    });

    test("Alice can transfer to anyone", async () => {
        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');
        const unit = DPRToAtom(2);
        await api.tx.balances.transfer('5Do5y4d8KBQcGHwgd9k7fh1fj3ra5twoayMEgyo6otkV4kzq', unit).signAndSend(alice);

        await delay(6000);

        const { nonce, data: balance } = await api.query.system.account('5Do5y4d8KBQcGHwgd9k7fh1fj3ra5twoayMEgyo6otkV4kzq');
        // console.log(balance.free.toString());
        const free = BigInt(parseInt(balance.free.toString()));
        expect(free).toBe(unit);
    });
})