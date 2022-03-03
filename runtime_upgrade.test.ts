import { createApi, getAlice, delay } from './util';
import { ApiPromise } from '@polkadot/api';
import * as fs from 'fs';

let api: ApiPromise;
beforeAll(async () => {
    api = await createApi();
});


test("can upgrade runtime is wasm file exists", async () => {
    const path = './deeper-chain.compact.wasm';
    if (fs.existsSync(path)) {
        const alice = getAlice();
        const code = fs.readFileSync(path).toString('hex');
        const proposal = api.tx.system.setCode(`0x${code}`);
    
        await api.tx.sudo
            .sudoUncheckedWeight(proposal, 10000)
            .signAndSend(alice);
    
        await api.connect();
        const version = api.consts.system.version.toJSON();
        expect(version['specVersion']).toBeGreaterThan(0);
    }
});

afterAll(async () => {
    await api.disconnect();
});