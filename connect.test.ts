import { ApiPromise } from '@polkadot/api';
import { createApi, getAlice, delay, getApi } from './util';

test("sequence call only connect once", async () => {
    const api1 = await getApi();
    const block1 = await api1.rpc.chain.getBlock();
    const api2 = await getApi();
    const block2 = await api2.rpc.chain.getBlock();
    expect(block1.block.header.number.toNumber()).toBe(block2.block.header.number.toNumber());
});

test("concurrent get api call only connect once", async () => {
    const [api1, api2] = await Promise.all([
        getApi(),
        getApi(),
    ]);
    const block1 = await api1.rpc.chain.getBlock();
    const block2 = await api2.rpc.chain.getBlock();

    expect(block1.block.header.number.toNumber()).toBe(block2.block.header.number.toNumber());

});

test("concurrent get block call only connect once", async () => {
    const api = await getApi();
    const [block1, block2] = await Promise.all([
        getLatestBlock(api),
        getLatestBlock(api),
    ]);
    expect(block1).toBe(block2);
});

async function getLatestBlock(api: ApiPromise): Promise<number> {
    const block = await api.rpc.chain.getBlock();
    return block.block.header.number.toNumber();
}