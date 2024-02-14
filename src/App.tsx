import { ChangeEvent, useEffect, useState } from 'react'
import logo from './assets/logo.svg'
import { NewNoteCard } from './components/NewNoteCard/NewNoteCard'
import { NoteCard } from './components/NoteCard/NoteCard'

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');

    if(notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }
    return []
  });
  const [notesFilter, setNotesFilter] = useState(notes)

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const newNotes = [newNote, ...notes];

    setNotes(newNotes)

    localStorage.setItem('notes', JSON.stringify(newNotes))
  }
 
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value 

    setSearch(query)
  }

  function onNoteDeleted(id: string) {
    const newNotes = notes.filter(note => {
      return note.id !== id
    })

    setNotes(newNotes)

    localStorage.setItem('notes', JSON.stringify(newNotes))
  }

  function onNoteEdit(id: string, content: string) {
    const noteEditId = notes.findIndex(note => {
      return note.id === id
    })

    const newNote = {
      id,
      date: new Date(),
      content
    }

    notes.splice(noteEditId, 1)

    const newNotes = [newNote, ...notes];
    setNotes(newNotes)
    localStorage.setItem('notes', JSON.stringify(newNotes))
  }

  useEffect(() => {
    const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

    setNotesFilter(filteredNotes)
  }, [notes, search])

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt='NLW Expoert'/>
      <form className='w-full'>   
        <input 
          type="text" 
          placeholder='Busque por sua nota...'
           className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500 '
          onChange={handleSearch} 
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6'>
        <NewNoteCard onNoteCreated={onNoteCreated} />
        
        {notesFilter.map(note => (
          <NoteCard note={note} onNoteDeleted={onNoteDeleted} onNoteEdit={onNoteEdit} />
        ))}
      </div>

    </div>
  )
}