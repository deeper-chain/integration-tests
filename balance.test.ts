import { createApi, getAlice, getTestAccount1 } from './util';
import { ApiPromise } from '@polkadot/api';

let api: ApiPromise;
beforeAll(async () => {
    api = await createApi();
});

test("root can set balance", async () => {
    const alice = getAlice();
    const testAccount1 = getTestAccount1();
    const txHash = await api.tx.sudo.sudo(api.tx.balances.setBalance(testAccount1.address, '1000000000000000000', 0)).signAndSend(alice, { nonce: -1 });
    expect(txHash.length).toBe(32);
});

test('can transfer', async () => {
    const alice = getAlice();
    const testAccount1 = getTestAccount1();

    const txHash = await api.tx.balances.transfer(testAccount1.address, '500000000000000000').signAndSend(alice, { nonce: -1 });
    expect(txHash.length).toBe(32);
});

afterAll(async () => {
    await api.disconnect();
});