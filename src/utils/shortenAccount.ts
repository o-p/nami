const rAccount = /^(0x[0-9a-fA-F]{4})[0-9a-fA-F]{32}([0-9a-fA-F]{4})$/
export default function shortenAccount(account: string) {
  return account.replace(rAccount, '$1...$2')
}
