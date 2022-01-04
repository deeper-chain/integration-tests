const { WsProvider, ApiPromise } = require('@polkadot/api');

async function createApi() {
    const provider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({
        provider,
        types: {
            Address: 'MultiAddress',
            LookupSource: 'MultiAddress',
            AccountInfo: 'AccountInfoWithDualRefCount',
            IpV4: 'Vec<u8>',
            CountryRegion: 'Vec<u8>',
            DurationEras: 'u8',
            Node: {
                account_id: 'AccountId',
                ipv4: 'IpV4',
                country: 'CountryRegion',
                expire: 'BlockNumber',
            },
            ChannelOf: {
                client: 'AccountId',
                server: 'AccountId',
                balance: 'Balance',
                nonce: 'u64',
                opened: 'BlockNumber',
                expiration: 'BlockNumber',
            },
            CreditLevel: {
                _enum: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'],
            },
            CampaignId: 'u16',
            CreditSetting: {
                campaign_id: 'CampaignId',
                credit_level: 'CreditLevel',
                staking_balance: 'Balance',
                base_apy: 'Percent',
                bonus_apy: 'Percent',
                max_rank_with_bonus: 'u32',
                tax_rate: 'Percent',
                max_referees_with_rewards: 'u8',
                reward_per_referee: 'Balance',
            },
            EraIndex: 'u32',
            CreditData: {
                campaign_id: 'CampaignId',
                credit: 'u64',
                initial_credit_level: 'CreditLevel',
                rank_in_initial_credit_level: 'u32',
                number_of_referees: 'u8',
                current_credit_level: 'CreditLevel',
                reward_eras: 'EraIndex',
            },
            DelegatorData: {
                delegator: 'AccountId',
                delegated_validators: 'Vec<AccountId>',
                unrewarded_since: 'Option<EraIndex>',
                delegating: 'bool',
            },
            ValidatorData: {
                delegators: 'BTreeSet<AccountId>',
                elected_era: 'EraIndex',
            },
            RewardData: {
                total_referee_reward: 'Balance',
                received_referee_reward: 'Balance',
                referee_reward: 'Balance',
                received_pocr_reward: 'Balance',
                poc_reward: 'Balance',
            },
            ValidatorPrefs: {
                commission: 'Compact<Perbill>',
                blocked: 'bool',
            },
        },
    });
    return api;
}

module.exports.createApi = createApi;