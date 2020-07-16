
import {useEffect, useRef, useCallback, useState} from "preact/hooks"

const Lazy = ({children, fallback}) => {

  const timerRef = useRef([])
  const [release, setRelease] = useState(false)

  const releaseComponent = useCallback(() => {
    timerRef.current.push(setTimeout(() => {
      setRelease(true)
    }, 1000))
  }, [])

  const handleState = useCallback(e => {
    if (e.target.readyState === 'complete') {
      releaseComponent()
    }
  }, [releaseComponent])

  useEffect(() => {

    if(document.readyState === 'complete') {
      releaseComponent()
      return
    }

    document.addEventListener('readystatechange', handleState)

    return () => {
      document.removeEventListener('readystatechange', handleState)
    }

  }, [releaseComponent])

  useEffect(() => {
    return () => {
      if(timerRef.current) {
        timerRef.current.forEach(timer => {
          clearTimeout(timer)
        })
      }
    }
  }, [])

  return release ? children : fallback
}

export default Lazy