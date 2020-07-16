
import {useEffect, useRef, useCallback, useState} from "preact/hooks"

const Lazy = ({children, fallback}) => {

  const timerRef = useRef([])
  const [release, setRelease] = useState(false)

  const releaseComponent = useCallback(() => {
    timerRef.current.push(setTimeout(() => {
      setRelease(true)
    }, 1000))
  }, [])

  useEffect(() => {

    if(document.readyState === 'complete') {
      releaseComponent()
      return
    }

    window.addEventListener('load', releaseComponent())

    return () => {
      window.removeEventListener('load', releaseComponent())
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