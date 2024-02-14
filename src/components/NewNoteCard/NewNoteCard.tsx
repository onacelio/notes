import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechrecognition: SpeechRecognition | null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if(event.target.value === '') {
      setShouldShowOnboarding(true )
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === '') {
      return 
    } 

    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Nota criada com sucesso')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window 
    || 'webkitSpeechRecognition' in window
    
    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Infelizmente seu navegador não suporta essa funcionalidade!')
      return 
    }
    
    setIsRecording(true)
    setShouldShowOnboarding(false)

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    speechrecognition = new speechRecognitionAPI();

    speechrecognition.lang = 'pt-BR';
    speechrecognition.continuous = true;
    speechrecognition.maxAlternatives = 1;
    speechrecognition.interimResults = true;

    speechrecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')
      setContent(transcription)
    }

    speechrecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if(speechrecognition !== null) {
      speechrecognition.stop()
    }
  }

  return (
   <Dialog.Root>
     <Dialog.Trigger className='rounded-md bg-slate-700 p-5 space-y-3 flex flex-col text-left gap-3 hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60'/>
        <Dialog.Content className='fixed inset-0 md:inset-auto overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
          </Dialog.Close>

          <form  className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3  p-5'>
            <span className='text-sm font-medium text-slate-300'>
              Adicionar nota
            </span>
            {shouldShowOnboarding ? (
              <p className='text-sm leading-6 text-slate-400'>
                Comece gravando uma nota{' '}
                <button
                  type='button'
                  onClick={handleStartRecording}
                  className='font-medium text-lime-400 hover:underline'
                >
                  gravando um áudio
                </button> ou se preferir {' '}
                <button
                  type='button'
                  className='font-medium text-lime-400 hover:underline'
                  onClick={handleStartEditor}
                > {' '}
                  Escrevendo um texto
                </button>
              </p>
            ) : (
              <textarea 
                autoFocus
                className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'  
                onChange={handleContentChange}
                value={content}
              />
            )}
            </div>

            {isRecording ? (
              <button className='flex items-center justify-center gap-2 w-full bg-slate-900 text-center text-sm text-slate-300 py-4 outline-none font-medium hover:text-slate-100' type='button' onClick={handleStopRecording} >
                <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                <span>
                  Gravando! (Clique para interromper)
                </span>
              </button>
            ) : (
              <button className='w-full bg-lime-400 text-center text-sm text-lime-950 py-4 outline-none font-medium hover:bg-lime-500' type='button' onClick={handleSaveNote} >
                <span>
                  Salvar nota
                </span>
              </button>
            )}
          </form>
        </Dialog.Content> 
      </Dialog.Portal>
   </Dialog.Root>
  )
}