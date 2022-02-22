import React from 'react'
import MuiSelect from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core'
import { themeConfig } from 'theme'

interface IOption {
  value: any
  content: string | React.ReactChild
}

interface ISelect {
  id?: string
  value: any
  onChange: (
    event: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
    child: React.ReactNode
  ) => void
  options: IOption[]
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: themeConfig.beige.light,
    borderRadius: themeConfig.borderRadius.main,
    color: theme.palette.text.secondary,
    height: '38px',
  },
  menuItem: {
    color: theme.palette.text.secondary,
    background: themeConfig.beige.light,
  },
}))

export default function Select({ id, value, onChange, options }: ISelect) {
  const classes = useStyles()
  return (
    <MuiSelect
      className={classes.root}
      id={id || 'mui-select'}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <MenuItem
          className={classes.menuItem}
          key={option.value}
          value={option.value}
        >
          {option.content}
        </MenuItem>
      ))}
    </MuiSelect>
  )
}
