import { mnemonicGenerate, mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util'

test("can generate secret", async () => {
    const mnemonic = mnemonicGenerate();
    const secretArr = mnemonicToMiniSecret(mnemonic);
    const secret = u8aToHex(secretArr);

    expect(secret.startsWith('0x')).toBe(true);
    expect(secret.length).toBe(66);
    expect(secret).toBe(secret.toLowerCase());
});