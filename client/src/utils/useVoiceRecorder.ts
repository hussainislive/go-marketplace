import { useRef, useState, useCallback } from 'react'

interface VoiceRecorder {
  recording: boolean
  seconds: number
  start: () => Promise<void>
  stop: () => Promise<File | null>
  cancel: () => void
}

export function useVoiceRecorder(): VoiceRecorder {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const stream = useRef<MediaStream | null>(null)

  const cleanup = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    stream.current?.getTracks().forEach(t => t.stop())
    stream.current = null
    setRecording(false)
    setSeconds(0)
  }, [])

  const start = useCallback(async () => {
    const media = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.current = media
    chunks.current = []
    const recorder = new MediaRecorder(media)
    recorder.ondataavailable = e => chunks.current.push(e.data)
    recorder.start()
    mediaRecorder.current = recorder
    setRecording(true)
    setSeconds(0)
    timer.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }, [])

  const stop = useCallback((): Promise<File | null> => {
    return new Promise(resolve => {
      const recorder = mediaRecorder.current
      if (!recorder) {
        cleanup()
        resolve(null)
        return
      }
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        cleanup()
        resolve(new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' }))
      }
      recorder.stop()
    })
  }, [cleanup])

  const cancel = useCallback(() => {
    mediaRecorder.current?.stop()
    cleanup()
  }, [cleanup])

  return { recording, seconds, start, stop, cancel }
}
