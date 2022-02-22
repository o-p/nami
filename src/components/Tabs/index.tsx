import React from 'react'
import MuiTabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import useStyles from './Tabs.styles'

interface ITabs {
  value: string
  handleChange: (event: React.ChangeEvent<{}>, value: any) => void
  tabs: any
}

export default function Tabs({ value, handleChange, tabs }: ITabs) {
  const classes = useStyles()
  return (
    <MuiTabs
      className={classes.tabs}
      value={value}
      indicatorColor="primary"
      textColor="primary"
      aria-label="disabled tabs example"
      onChange={handleChange}
    >
      {Object.keys(tabs).map((item) => (
        <Tab
          className={classes.tab}
          key={item}
          value={item}
          label={tabs[item]}
        />
      ))}
    </MuiTabs>
  )
}
