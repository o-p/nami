import React from 'react'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import useStyles from './Accordion.styles'

interface IAccordion {
  title: any
  children: React.ReactNode
  expanded: boolean
}

export default function Accordion({ title, children, expanded }: IAccordion) {
  const classes = useStyles()
  return (
    <MuiAccordion
      square
      className={classes.root}
      expanded={expanded}
      // onChange={handleChange('panel1')}
    >
      <MuiAccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        className={classes.title}
      >
        {title}
      </MuiAccordionSummary>
      <MuiAccordionDetails>{children}</MuiAccordionDetails>
    </MuiAccordion>
  )
}
