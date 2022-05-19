import useResizeObserver from "@react-hook/resize-observer"
import React from "react"

export default function useSize<T extends HTMLElement>(target: React.RefObject<T>) {
    const [size, setSize] = React.useState({width: 0, height: 0})
  
    React.useLayoutEffect(() => {
      setSize(target?.current?.getBoundingClientRect() ?? {width: 0, height: 0})
    }, [target])
  
    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
  }
