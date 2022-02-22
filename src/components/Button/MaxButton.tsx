import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  max: {
    cursor: 'pointer',
    color: 'red',
    background: '#654e4e',
  },
})

export default function MaxButton({
  onMax,
  className,
}: {
  onMax: () => void
  className?: string
}) {
  const classes = useStyles()
  return (
    <button
      className={`${className} ${classes.max}`}
      onClick={onMax}
      type="button"
    >
      MAX
    </button>
  )
}
