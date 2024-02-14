import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

type NoteCardProps = {
  note: {
    id: string;
    date: Date;
    content: string;    
  };
  onNoteDeleted: (id: string) => void;
  onNoteEdit: (id: string, content: string) => void;
}

export function NoteCard({ note, onNoteDeleted, onNoteEdit }: NoteCardProps) {
  const [content, setContent] = useState(note.content)

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if(event.target.value === '') {
      onNoteDeleted(note.id)
      toast.success("Nota deletada com sucesso!")
    }
  }

  function handleEditNote(event: FormEvent) {
    event.preventDefault()

    if (content === '') {
      return 
    } 

    onNoteEdit(note.id, content)
    toast.success('Nota editada com sucesso')
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md bg-slate-800 p-5 space-y-3 outline-none overflow-hidden relative hover:ring-2 hover:ring-slate-600 text-left focus-visible:ring-2 focus-visible:ring-lime-400 flex flex-col gap-3' >
        <span className='text-sm font-medium text-slate-300'>{formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}</span>
        <p className='text-sm leading-6 text-slate-400'>
          {note.content}
        </p>

        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'/>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60'/>
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
          </Dialog.Close>
          <div className='flex flex-1 flex-col gap-3  p-5'>
          <span className='text-sm font-medium text-slate-300'>{formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}</span>
          <textarea 
                autoFocus
                className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'  
                onChange={handleContentChange}
                defaultValue={note.content}
              />
          </div>

          <div className='flex'>
            <button className='w-full bg-lime-400 text-center text-sm text-lime-950 py-4 outline-none font-medium hover:bg-lime-500' type='button' onClick={handleEditNote} >
              <span>
                Salvar nota
              </span>
            </button>

            <button className='w-full bg-slate-800 text-center text-sm text-slate-300 py-4 outline-none font-medium group' onClick={() => onNoteDeleted(note.id)}>
              <span className='text-red-400 group-hover:underline'>
                Apagar nota
              </span>
            </button>
          </div>
        </Dialog.Content> 
      </Dialog.Portal>
    </Dialog.Root>
  )
}