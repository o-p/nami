import React, { useEffect } from 'react'

const onlyOnce: React.DependencyList = []

export default function useMount(onMount: React.EffectCallback) {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(onMount, onlyOnce)
}
