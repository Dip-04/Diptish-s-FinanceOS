interface Window {
  SpeechRecognition?: typeof SpeechRecognition
  webkitSpeechRecognition?: typeof SpeechRecognition
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

interface SpeechRecognition extends EventTarget {
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  start(): void
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
