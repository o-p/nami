import { createContext, useContext } from 'react'
import { bigZero } from 'utils/ethers'
import { useUserPortfolio } from 'hooks/useUserPortfolio'
import { IUserContext, IUserVaultAssets } from './Types'

export const UserContext = createContext({
  portfolio: {
    deposits: bigZero,
    acornEarned: bigZero,
    getPoolDeposits: () => new Promise<void>((resolve) => resolve()),
    getAcornsEarned: () => new Promise<void>((resolve) => resolve()),
    getUserStaking: () => new Promise<void>((resolve) => resolve()),
    isLoading: false,
    userVaults: {
      totalStaked: bigZero,
      totalBalance: bigZero,
      assets: [] as IUserVaultAssets[],
    },
  },
})

export const UserProvider: React.FC = ({ children }) => {
  const portfolio = useUserPortfolio()

  return (
    <UserContext.Provider value={{ portfolio }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext(): IUserContext {
  const context = useContext<IUserContext>(UserContext)
  return context
}
