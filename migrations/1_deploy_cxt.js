const CXT = artifacts.require("CXT")
const { BN } = web3.utils

const b10 = new BN(10)
const b100 = new BN(100)

// 40% public
// 20% CEX
// 10% Airdrop
// 10% ECO
// 10% Founders
// 10% Team
const Shares = [
  { share: b10, address: '0x7d3Af8BaC7691479d2ec94ef6D3a536d86D7cEF9' },
  { share: b10, address: '0xCFdEB33191AA3Ea100c1b12d2f5C729232096a6C' },
  { share: b10, address: '0x438dBaE1Fd463906FE7fFd239dff0C24f1D365c3' },
  { share: b10, address: '0x69e04F3E8f842Ad205e96aB77d5774Cb4fbEfe66' },
]

module.exports = async function (deployer, network, [owner]) {
  await deployer.deploy(CXT)

  const token = await CXT.deployed()
  const total = await token.totalSupply()

  await Promise.all(
    Shares.map(({ share, address }) =>
      token.transfer(address, total.mul(share).div(b100))
    )
  )
    .then(txs => txs.forEach(({ logs }) => {
      const [ev] = logs
      console.log(`Transfered ${web3.utils.fromWei(ev.args[2])} CXT to ${ev.args[1]}`)
    }))

  await token.balanceOf(owner)
    .then((bn) => {
      console.log(`   Remains ${web3.utils.fromWei(bn)} CXT in ${owner}`)
    })
}
