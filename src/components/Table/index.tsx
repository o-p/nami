import { MouseEvent } from 'react'
import MuiTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import useStyles from './Table.styles'

type align = 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined

export interface ITableHeader {
  value: string
  align: align
}

interface ITable {
  onCellClick: (event: MouseEvent) => void
  tableHeaders: ITableHeader[]
  cells: any
  rows: any[]
  tableRowKey: string
  prependCell?: Function
  rootClass?: string
  containerClass?: string
}

export default function Table({
  onCellClick,
  tableHeaders,
  rootClass,
  containerClass,
  tableRowKey,
  prependCell,
  cells,
  rows,
}: ITable) {
  const classes = useStyles()

  const renderCell = (row: any, key: string) => {
    const alignment = cells[key] ? cells[key].align : 'center'
    return (
      <TableCell key={key} align={alignment} className={classes.cell}>
        {prependCell && prependCell(key, row[key])}
        {row[key]}
      </TableCell>
    )
  }

  return (
    <TableContainer className={containerClass} component={Paper}>
      <MuiTable className={rootClass || classes.root} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders.map((headerItem) => (
              <TableCell align={headerItem.align} key={headerItem.value}>
                {headerItem.value}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row[tableRowKey]} onClick={() => onCellClick(row)}>
              {Object.keys(cells).map((key) => renderCell(row, key))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
