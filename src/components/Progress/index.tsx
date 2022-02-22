import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

interface IProgress {
  stoppagePercent?: number
  progressClasses?: any
  progress: number
  setProgress: React.Dispatch<React.SetStateAction<number>>
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
})

export default function Progress({
  stoppagePercent = 100,
  progressClasses,
  progress,
  setProgress,
}: IProgress) {
  const classes = useStyles()

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= stoppagePercent) {
          clearInterval(timer)
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, stoppagePercent)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [stoppagePercent, setProgress])

  return (
    <div className={classes.root}>
      <LinearProgress
        classes={progressClasses}
        variant="determinate"
        value={progress}
      />
    </div>
  )
}
