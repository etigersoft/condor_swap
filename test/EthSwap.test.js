const { assert } = require('chai');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function toWei(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap

    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        // Transfer all tokens to EthSwap (1M)
        await token.transfer(ethSwap.address, toWei('1000000'));
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            let token = await Token.new()
            const name = await token.name()
            assert.equal(name,'Condor')
        })      
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name,'EthSwap Instant Exchange')
        })
        it('contract has the 1M tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), toWei('1000000'))
        })
    })

    describe('buyTokens()', async () => {
        let result

        before (async () => {
            // Purchase tokens before each example
            result = await ethSwap.buyTokens({from: investor, value: toWei('1')})
        })

        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
            // Check investor balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), toWei('100'))

            // Check ethSwapbalance after purchase
            let ethSwapbalance

            // Did the ethSwap address reduce theirs token inventory ?
            ethSwapbalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapbalance.toString(), toWei('999900'))
            
            // Did the ethSwap address received 1 eth in exchange of the tokens sold ?
            ethSwapbalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapbalance.toString(), toWei('1'))

            // Check logs to ensure event was emitted with correct data
            //console.log(result.logs)
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), toWei('100').toString())
            assert.equal(event.rate.toString(), '100')
        })

    })

    describe('sellTokens()', async () => {
        let result

        before (async () => {
            await token.approve(ethSwap.address, toWei('100'), { from: investor})
            result = await ethSwap.sellTokens(toWei('100'), { from: investor })
        })

        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
             // Check investor balance after purchase
             let investorBalance = await token.balanceOf(investor)
             assert.equal(investorBalance.toString(), toWei('0'))

            // Check ethSwapbalance after purchase
            let ethSwapbalance

            // Did the ethSwap address increase theirs token inventory ?
            ethSwapbalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapbalance.toString(), toWei('1000000'))
            
            // Did the ethSwap address reduced 1 eth in exchange of the tokens sold ?
            ethSwapbalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapbalance.toString(), toWei('0'))

            // Check logs to ensure event was emitted with correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), toWei('100').toString())
            assert.equal(event.rate.toString(), '100')

            // FAILURE: investor cannot sell more tokens than they have (TODO: review this later)
            await ethSwap.sellTokens(toWei('500'), { from: investor }).should.be.rejected;

        })

    })
})