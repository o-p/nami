import { Status } from 'components/Snackbar'
import { useState } from 'react'
import { max } from 'utils/ethers'
import Button from '.'

interface IApproval {
  contract: any
  allowAddress: string
  setsnackbarStatus: Function
  callback?: any
  disabled?: boolean
  className?: string
  approveText?: string
}

export default function Approval({
  disabled,
  callback,
  contract,
  allowAddress,
  setsnackbarStatus,
  className,
  approveText,
}: IApproval) {
  const [isLoading, setisLoading] = useState(false)
  const handleClick = async () => {
    setisLoading(true)
    try {
      const tx = await contract.approve(allowAddress, max)
      await tx.wait()
      if (callback) {
        await callback()
        setsnackbarStatus(Status.unlock)
      }
      setisLoading(false)
    } catch (error) {
      console.log('error:', error)
      setisLoading(false)
    }
  }

  return (
    <Button
      className={className}
      isLoading={isLoading}
      disabled={disabled}
      onClick={handleClick}
    >
      {approveText || 'Approve'}
    </Button>
  )
}
