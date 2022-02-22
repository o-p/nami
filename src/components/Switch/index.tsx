import React from 'react'
import MuiSwitch from '@material-ui/core/Switch'

interface ISwitch {
  name?: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: Function
  checked: boolean
}

export default function Switch({
  name,
  handleChange,
  checked,
  onClick,
}: ISwitch) {
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setState({ ...state, [event.target.name]: event.target.checked })
  // }

  return (
    <MuiSwitch
      checked={checked}
      onChange={handleChange}
      // @ts-ignore
      onClick={onClick}
      color="primary"
      name={name || 'switch'}
      // inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  )
}
