const RWD = artifacts.require('RWD');
const Tether = artifacts.require('Tether');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('DecentralBank', ([owner, customer]) => {
    let rwd;
    let tether;
    let decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number.toString(), 'ether');
    }

    before(async () => {
        rwd = await RWD.new();
        tether = await Tether.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        await rwd.transfer(decentralBank.address, tokens('1000000'));
        await tether.transfer(customer, tokens('100'), { from: owner });
    });
    
    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name();
            assert.equal(name, 'Tether Douglas');
        });
    });

    describe('RWD Token', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name();
            assert.equal(name, 'Reward Token');
        });
    });

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank');
        });

        it('contract has tokens', async () => {
            const balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance.toString(), tokens('1000000'));
        });
    });

    describe('Yield Farming', async () => {
        it('rewards tokens for staking', async () => {

            const r = await tether.balanceOf(customer);
            assert.equal(r.toString(), tokens('100'), 'customer mock wallet balance');

            await tether.approve(decentralBank.address, tokens('100'), {from: customer});

            await decentralBank.depositTokens(tokens('100'), {from: customer});
            const result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance before staking');

            const result2 = await decentralBank.stakingBalance(customer);
            assert.equal(result2.toString(), tokens('100'), 'customer mock wallet balance before staking');
            // assert.equal(decentralBank.hasStaked[customer], true);

            const result3 = await decentralBank.isStaked(customer);
            assert.equal(result3, true, 'customer is staking status after staking');
        })
    });
});