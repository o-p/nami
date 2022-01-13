const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require('@openzeppelin/test-helpers')
const { expect } = require('chai')

contract('CXT', ([deployer, ...users]) => {
  beforeEach(async () => {
    this.cxt = await artifacts.require('CXT').new()
  })

  it('Basic info', async () => {
    const { cxt } = this
    expect(await cxt.name()).to.be.a('string').that.equals('CXT')
    expect(await cxt.symbol()).to.be.a('string').that.equals('CXT')
    expect(await cxt.decimals()).is.a.bignumber.that.eq('18')
    expect(await cxt.owner()).is.equals(deployer)
  })
  
  it('Whitepaper info', async () => {
    const { cxt } = this
    expect(await cxt.totalSupply()).is.a.bignumber.that.eq(web3.utils.toWei(10e9.toString()))
    expect(await cxt.MIN_TOTAL_SUPPLY()).is.a.bignumber.that.eq(web3.utils.toWei((4e9.toString())))
    expect(await cxt.MAX_FEE_PER_WEEK()).is.a.bignumber.that.eq(web3.utils.toWei(5e8.toString()))
    expect(await cxt.FEE_RATE()).is.a.bignumber.that.eq(web3.utils.toWei('0.05'))
  })

  it('Transfer with fees', async () => {
    const { cxt } = this

    await cxt.removeFromExcluded(deployer)

    // deployer -> U[0] <7B>
    const r1 = await cxt.transfer(users[0], web3.utils.toWei(`${7e9}`), { from: deployer })

    expectEvent(r1, 'Transfer', {
      from: deployer,
      to: users[0],
      value: web3.utils.toWei(`${7e9 * .95}`),
    })
    expectEvent(r1, 'Transfer', {
      from: deployer,
      to: constants.ZERO_ADDRESS,
      value: web3.utils.toWei(`${7e9 * .05}`),
    })

    // U[0] -> U[1] <4B> ==> over the weekly fee limit
    await cxt.transfer(users[1], web3.utils.toWei(`${4e9}`), { from: users[0] })

    expect(await cxt.totalSupply())
      .is.a.bignumber.that.eq(web3.utils.toWei(`${10e9 - 5e8}`))

    // deployer -> U[2] <2B> ==> no fee
    await cxt.transfer(users[2], web3.utils.toWei(`${2e9}`), { from: deployer })
    expect(await cxt.balanceOf(users[2]))
      .is.a.bignumber.that.eq(web3.utils.toWei(`${2e9}`))
  })

  it('Weekly fee limitation', async () => {
    const cxt = await artifacts.require('MockCXT').new()

    // transfer all to U1, no fee
    await cxt.transfer(users[1], web3.utils.toWei(`${10e9}`))

    // week 1
    // total transfer 5B (fee 0.25 B) / total 10B - 0.25 B = 9.75B
    await cxt.setTime(86400 * 10)
    await cxt.transfer(users[2], web3.utils.toWei(`${3e9}`), { from: users[1] })
    await cxt.transfer(users[3], web3.utils.toWei(`${2e9}`), { from: users[1] })
    expect(await cxt.totalSupply()).is.a.bignumber.that.eq(web3.utils.toWei(`${9.75e9}`))

    // week 2
    // total transfer 12B (fee is MAX 0.5B) / total 10B - 0.75B = 9.25B
    await cxt.setTime(86400 * (10 + 7))
    await cxt.transfer(users[4], web3.utils.toWei(`${5e9}`), { from: users[1] })
    await cxt.transfer(users[1], web3.utils.toWei(`${4e9}`), { from: users[4] })
    await cxt.transfer(users[4], web3.utils.toWei(`${3e9}`), { from: users[1] })
    expect(await cxt.totalSupply()).is.a.bignumber.that.eq(web3.utils.toWei(`${9.25e9}`))
    await cxt.setTime(86400 * (10 + 9))
    await cxt.transfer(users[1], web3.utils.toWei(`${2e9}`), { from: users[4] })
    // still in week 2, no fee
    expect(await cxt.totalSupply()).is.a.bignumber.that.eq(web3.utils.toWei(`${9.25e9}`))

    // week 3, fee 0.05B / total 9.2B
    await cxt.setTime(86400 * (10 + 14))
    await cxt.transfer(users[2], web3.utils.toWei(`${1e9}`), { from: users[3] })
    expect(await cxt.totalSupply()).is.a.bignumber.that.eq(web3.utils.toWei(`${9.2e9}`))
  })
})
