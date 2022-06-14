import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady, blake2AsU8a } from '@polkadot/util-crypto';
import { bufferToU8a, u8aToHex } from '@polkadot/util';
import { BN, Endianness } from 'bn.js';

test('can add private to keyring', async () => {
    await cryptoWaitReady();
    const keyring = new Keyring({ type: 'sr25519' });
    const keyPair = keyring.addFromUri('0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'); // Alice

    expect(keyPair.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
});

test('can construct and sign payload', async () => {
    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a');
    const payload = constructPayload('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 1, 1, 100);
    expect(u8aToHex(payload)).toBe('0x82ea444f69d7234cfa46519d7a32103fc2ead04a4dbb7c1a8e070a07676073f4'); // u8a: [130, 234 ... 115, 244]

    let sig = constructSig(alice, '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', 1, 1, 100);
    expect(sig.length).toBe(130); // sign will add random nonce, so change everytime
});

function numberToArray(num: number | bigint, encoding: Endianness, size: number): number[] {
    const bnNum = new BN(num.toString(), 10);
    return bnNum.toArray(encoding, size);
}

const DPR = Math.pow(10, 18); // 18 decimals
const ONE_BILLION = 1000000000;
function DPRToAtom(amt: number) {
    return BigInt(amt * ONE_BILLION) * BigInt(DPR / ONE_BILLION);
}

function constructPayload(addr: string, nonceNum: number, sessionIdNum: number, amtNum: number): Uint8Array {
    let keyring = new Keyring();
    let pubkey = keyring.decodeAddress(addr);
    let arr = [];
    let nonce = numberToArray(nonceNum, 'be', 8);
    let sessionId = numberToArray(sessionIdNum, 'be', 4);
    let amount1 = DPRToAtom(amtNum);
    let amount2 = numberToArray(amount1, 'le', 16); // amount is le encoded
    arr.push(...pubkey, ...nonce, ...sessionId, ...amount2);
    let msg = blake2AsU8a(bufferToU8a(arr));
    return msg;
}

function constructSig(senderKeyPair: KeyringPair, addr: string, nonceNum: number, sessionIdNum: number, amtNum: number): string {
    const payload = constructPayload(addr, nonceNum, sessionIdNum, amtNum);
    let signature = senderKeyPair.sign(payload);
    let hexsig = u8aToHex(signature);

    return hexsig;
}