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
});