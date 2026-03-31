"use client"
import * as React from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}

export default useDebounce