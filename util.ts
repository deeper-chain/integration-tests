import { WsProvider, ApiPromise, Keyring } from '@polkadot/api';
import '@polkadot/api-augment';
import deeperTypes from './types/types.json';

const keyring = new Keyring({ type: 'sr25519' });

export async function createApi(): Promise<ApiPromise> {
    const provider = new WsProvider('ws://127.0.0.1:9944');

    const api = await ApiPromise.create({
        provider,
        types: deeperTypes,
    });

    return api;
}

export function getAlice() {
    return keyring.addFromUri('//Alice');
}