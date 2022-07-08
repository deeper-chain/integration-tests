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

let api: Promise<ApiPromise> | null = null;
export async function getApi(): Promise<ApiPromise> {
    if (api) {
        return api;
    }
    const provider = new WsProvider('ws://127.0.0.1:9944?test=1');
    provider.on('connected', () => {
        console.log('ws connected only once');
    });

    const api1 = ApiPromise.create({
        provider,
        types: deeperTypes,
    });
    api = promiseWithTimeout(api1, 60000, (resolve: any) => {
        resolve(null);
    });

    return api;
}

export function getAlice() {
    return keyring.addFromUri('//Alice');
}

export function getTestAccount1() {
    return keyring.addFromMnemonic('ladder fluid joke certain identify nominee infant size protect post obtain reform');
}

export async function delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function promiseWithTimeout(promise: any, ms: number, onTimeout: any) {
    let timer: any = null;

    const timedPromise = new Promise((resolve, reject) => {
        timer = setTimeout(() => {
            onTimeout(resolve, reject);
        }, ms);
    });

    return Promise.race([promise, timedPromise]).finally(() => {
        clearTimeout(timer);
    });
}