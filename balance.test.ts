import { createApi, getAlice } from './util';
import { ApiPromise } from '@polkadot/api';

let api: ApiPromise;
beforeAll(async () => {
    api = await createApi();
});

test("root can clear old balance", async () => {
    const alice = getAlice();
    await api.tx.sudo.sudo(api.tx.balances.setBalance('5Do5y4d8KBQcGHwgd9k7fh1fj3ra5twoayMEgyo6otkV4kzq', '1000000000000000000', '1000000000000000000')).signAndSend(alice);
    const accountInfo = await api.query.system.account('5Do5y4d8KBQcGHwgd9k7fh1fj3ra5twoayMEgyo6otkV4kzq');
    expect(BigInt(accountInfo.data.free.toString())).toBe(BigInt('1000000000000000000'));
});

afterAll(async () => {
    await api.disconnect();
});