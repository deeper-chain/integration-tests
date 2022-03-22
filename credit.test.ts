import { createApi, getAlice, delay } from './util';
import { ApiPromise } from '@polkadot/api';

let api: ApiPromise;
beforeAll(async () => {
    api = await createApi();
});

test("invalid signature can not add credit", async () => {
    const alice = getAlice();
    const unsub = await api.tx.creditAccumulation.addCreditByTraffic(1, '0x123').signAndSend(alice, { nonce: -1 }, ({ status, events, dispatchError }) => {
        if (!status.isFinalized && !status.isInBlock) {
            return;
        }
        expect(dispatchError).not.toBe(true);
        if (dispatchError) {
            expect(dispatchError.asModule.index.toNumber()).toBe(62);
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;
            expect(docs[0]).toBe('Invalid atomos nonce');
            expect(name).toBe('InvalidAtomosNonce');
            expect(section).toBe('creditAccumulation');
        }
        unsub();
    });
    await delay(10000);
});

afterAll(async () => {
    await api.disconnect();
});