import React, { createContext, useContext, useEffect, useState } from 'react';
import { createNoteApi, deleteNoteApi, getAllNotesApi, searchNotesByQueryApi, updateNoteApi } from '../api/notesApi';
import { useWebSocket } from './WebSocketContext';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  archived: boolean;
  metadata: object;
  status: 'processing' | 'completed' | 'failed';
}

interface NotesContextType {
  notes: Note[];
  searchedNotes: Note[];
  setSearchedNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  getAllNotes: () => void;
  searchNotesByQuery: (query: string) => void;
  createNote: (note: Partial<Note>) => void;
  updateNote: (id: string, updatedNoteData: Partial<Note>) => void;
  archiveNote: (id: string) => void;
  softDeleteNote: (id: string) => void;
  deleteNote: (id: string) => void;
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);
  const [notes, setNotes] = useState<Note[]>([
    /* {
        id: '1',
        title: 'Teste 1',
        content: 'Conteúdo do teste 1',
        date: new Date(),
        archived: false,
    } */
  ]);

  const { webSocketService, socketId } = useWebSocket();

  useEffect(() => {
    webSocketService.registerCallback('processing', (data) => {
      console.log(`PROCESSANDO: ${JSON.stringify(data)}`);

      /* const noteId = JSON.stringify(data.noteId);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, status: 'processing' } : note
        )
      ); */
    });

    webSocketService.registerCallback('completed', (data) => {
      console.log(`COMPLETOU: ${JSON.stringify(data)}`);

      /* const noteId = JSON.stringify(data.noteId);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, status: 'completed' } : note
        )
      ); */
    });

  }, [webSocketService]);

  const searchNotesByQuery = async (query: string) => {
    const { data, error } = await searchNotesByQueryApi({ query: query });

    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      setSearchedNotes(data as Note[]);
      console.log("Successfully searched notes by query", data);
    }
  };


  const getAllNotes = async () => {
    const { data, error } = await getAllNotesApi();
    if (error) {
      console.log(error);
      return error;
    }

    //Testando CSS
    const x = data as Note[];

    x.push({
      id: '1',
      title: 'Teste 1',
      content: 'Conteúdo do teste 1',
      date: new Date().toISOString(),
      archived: false,
      metadata: {},
      status: 'processing'
    })

    if (data) {
      setNotes(data as Note[]);
      console.log("Successfully got all notes", data);
    }
  };

  const createNote = async (note: Partial<Note>) => {
    if (!socketId) {
      console.log("Socket ID não encontrado, não posso enviar o createNote");
      return;
    }

    const { data, error } = await createNoteApi({ title: note.title, content: note.content, metadata: note.metadata }, socketId);
    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      /* const newNote: Note = { ...data, status: 'processing' }; */ // Define status inicial como 'processing'
      setNotes([...notes, data]);
      console.log("Successfully created", data);
    }
  };

  const updateNote = async (id: string, updatedNoteData: Partial<Note>) => {
    const { data, error } = await updateNoteApi({ id, note: updatedNoteData });
    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      setNotes(notes.map(note => {
        if (note.id === id) {
          return { ...note, ...data };
        }
        return note;
      }));
      console.log("Successfully updated", data);
    }
  };

  const archiveNote = (id: string) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        return { ...note, archived: !note.archived };
      }
      return note;
    }));
  };

  const softDeleteNote = (id: string) => {
    /* setNotes(notes.map(note => {
        if (note.id === id) {
            return {...note, deleted: true };
        }
        return note;
    })); */
  };

  const deleteNote = async (id: string) => {
    const { error } = await deleteNoteApi({ id });
    if (error) {
      console.log(error);
      return error;
    }

    setNotes(notes.filter(note => note.id !== id));
    console.log("Successfully deleted", id);
  };

  return (
    <NotesContext.Provider value={{ notes, searchedNotes, setSearchedNotes, getAllNotes, searchNotesByQuery, createNote, updateNote, archiveNote, softDeleteNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export type { Note }
