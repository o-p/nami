import MuiInput from '@material-ui/core/Input'
import { useCallback } from 'react'

interface IInput {
  value: any
  id: string
  onChange: Function
  type?: string
  disabled?: boolean
  label?: string
  styleType?: 'borderBottom' | 'borders'
  className?: string
}

export default function Input({
  className,
  value,
  disabled,
  id,
  onChange,
  type = 'number',
}: // styleType = 'borderBottom',
IInput) {
  const onBlur = useCallback(
    (e) => {
      if (type === 'number' && !e.target.value) {
        e.target.value = 0
        onChange(e)
      }
    },
    [type, onChange]
  )

  return (
    <MuiInput
      className={className}
      onBlur={onBlur}
      disabled={disabled}
      onChange={(e) => onChange(e)}
      id={id}
      type={type}
      value={value}
    />
  )
}
