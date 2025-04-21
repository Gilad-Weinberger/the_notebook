"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Define note size options based on the image layout
const NOTE_SIZES = [
  { cols: 1, rows: 1, className: 'col-span-1 row-span-1' }, // Small square
  { cols: 2, rows: 1, className: 'col-span-2 row-span-1' }, // Medium horizontal
  { cols: 1, rows: 2, className: 'col-span-1 row-span-2' }, // Medium vertical
  { cols: 2, rows: 2, className: 'col-span-2 row-span-2' }, // Large square
];

// Define grid layouts with top-right positioning prioritized
const GRID_LAYOUTS = [
  // First row - top positions (prioritize top-right)
  { gridArea: '1 / 3 / 2 / 4', size: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' } }, // Top right
  { gridArea: '1 / 2 / 2 / 3', size: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' } }, // Top middle
  
  // Middle positions
  { gridArea: '2 / 2 / 3 / 4', size: { cols: 2, rows: 1, className: 'col-span-2 row-span-1' } }, // Middle horizontal
  { gridArea: '1 / 1 / 3 / 2', size: { cols: 1, rows: 2, className: 'col-span-1 row-span-2' } }, // Left vertical
  
  // Bottom positions
  { gridArea: '3 / 1 / 4 / 3', size: { cols: 2, rows: 1, className: 'col-span-2 row-span-1' } }, // Bottom horizontal
  { gridArea: '3 / 3 / 5 / 4', size: { cols: 1, rows: 2, className: 'col-span-1 row-span-2' } }, // Bottom right vertical

  // Additional positions for more notes
  { gridArea: '4 / 1 / 5 / 2', size: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' } }, // Bottom left
  { gridArea: '4 / 2 / 5 / 3', size: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' } }, // Bottom middle
  { gridArea: '5 / 1 / 6 / 2', size: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' } }, // Extra row bottom left
  { gridArea: '5 / 2 / 6 / 3', size: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' } }, // Extra row bottom middle
  { gridArea: '5 / 3 / 6 / 4', size: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' } }, // Extra row bottom right
];

// Function to dynamically generate new grid positions for additional notes
const generateAdditionalGridPosition = (index) => {
  const baseIndex = index % GRID_LAYOUTS.length;
  const rowOffset = Math.floor(index / GRID_LAYOUTS.length) * 5;
  
  // Parse the existing grid area format "rowStart / colStart / rowEnd / colEnd"
  const gridAreaParts = GRID_LAYOUTS[baseIndex].gridArea.split(' / ');
  const rowStart = parseInt(gridAreaParts[0]) + rowOffset;
  const colStart = gridAreaParts[1];
  const rowEnd = parseInt(gridAreaParts[2]) + rowOffset;
  const colEnd = gridAreaParts[3];
  
  return {
    gridArea: `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`,
    size: GRID_LAYOUTS[baseIndex].size
  };
};

// Color options - using light blue shades
const NOTE_COLORS = [
  'bg-blue-50', 
  'bg-blue-100', 
  'bg-indigo-50',
  'bg-sky-50',
  'bg-cyan-50'
];

const getRandomColor = () => {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
};

export default function NotesPanel({ subjectId, modelId }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  
  // Fetch user's notes for this subject and model
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user || !subjectId) return;

      try {
        setLoading(true);
        const notesQuery = query(
          collection(db, 'notes'),
          where('userId', '==', user.uid),
          where('modelId', '==', modelId || 'default')
        );
        
        const notesSnapshot = await getDocs(notesQuery);
        let notesList = notesSnapshot.docs.map(doc => {
          const noteData = doc.data();
          return {
            id: doc.id,
            ...noteData,
            color: getRandomColor(),
            createdAt: noteData.createdAt?.toDate?.() || noteData.createdAt || new Date()
          };
        });
        
        // Sort by creation date to ensure consistent layout assignment
        notesList = notesList.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Assign grid positions to notes
        notesList = notesList.map((note, index) => {
          // Use predefined layouts if available, or generate new positions
          const layout = index < GRID_LAYOUTS.length 
            ? GRID_LAYOUTS[index]
            : generateAdditionalGridPosition(index);
            
          return {
            ...note,
            gridArea: layout.gridArea,
            size: layout.size
          };
        });
        
        setNotes(notesList);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user, subjectId, modelId]);

  // Create new note
  const createNewNote = async () => {
    if (!user || !noteTitle.trim()) return;
    
    try {
      const newNote = {
        userId: user.uid,
        modelId: modelId || 'default',
        title: noteTitle || 'Untitled Note',
        content: noteContent,
        createdAt: serverTimestamp(),
        version: 1
      };
      
      const docRef = await addDoc(collection(db, 'notes'), newNote);

      // Determine which grid position to use for the new note
      const newIndex = notes.length;
      const layout = newIndex < GRID_LAYOUTS.length 
        ? GRID_LAYOUTS[newIndex]
        : generateAdditionalGridPosition(newIndex);
      
      const createdNote = {
        id: docRef.id,
        ...newNote,
        createdAt: new Date(),
        color: getRandomColor(),
        gridArea: layout.gridArea,
        size: layout.size
      };
              
      setNotes([createdNote, ...notes.map((note, i) => {
        // Shift existing notes down in the grid
        const shiftedIndex = i + 1;
        const shiftedLayout = shiftedIndex < GRID_LAYOUTS.length 
          ? GRID_LAYOUTS[shiftedIndex]
          : generateAdditionalGridPosition(shiftedIndex);
            
        return {
          ...note,
          gridArea: shiftedLayout.gridArea,
          size: shiftedLayout.size
        };
      })]);
      
      setNoteTitle('');
      setNoteContent('');
      setShowNoteForm(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Create and download a Word document from a note
  const generateWordDocument = (note) => {
    try {
      // Create a new document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title with heading style
            new Paragraph({
              text: note.title,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200,
              },
            }),
            
            // Content paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: note.content,
                  size: 24, // 12pt font
                }),
              ],
              spacing: {
                line: 360, // 1.5 line spacing
              },
            }),
            
            // Add timestamp at the bottom
            new Paragraph({
              children: [
                new TextRun({
                  text: `Created: ${new Date(note.createdAt).toLocaleString()}`,
                  size: 20,
                  italics: true,
                  color: "808080",
                }),
              ],
              spacing: {
                before: 400,
              },
            }),
          ],
        }],
      });

      // Create a blob from the document
      Packer.toBlob(doc).then(blob => {
        // Use FileSaver to save the file
        saveAs(blob, `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`);
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error creating document. Please try again.');
    }
  };

  // Handle note click to view/expand the note
  const handleNoteClick = (noteId) => {
    const clickedNote = notes.find(note => note.id === noteId);
    if (clickedNote) {
      // For now just log that the note was clicked
      // This could be expanded to show a modal with the full note content
      console.log('Note clicked:', clickedNote.title);
      // Future enhancement: add modal or expanded view functionality here
    }
  };

  return (
    <div className="p-5 h-full overflow-auto bg-white relative">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Grid container aligned to top-right with support for more rows */}
          <div 
            className="grid gap-2 mr-0 ml-auto mt-0 pb-20" // Added padding at the bottom to make room for the fixed plus button
            style={{ 
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: `repeat(${Math.max(5, Math.ceil(notes.length / 3) * 2)}, minmax(80px, auto))`,
              maxWidth: '95%'
            }}
          >
            {notes.map(note => (
              <div 
                key={note.id}
                className={`${note.color} rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden ${note.size?.className || ''} border border-blue-200 relative group`}
                style={{ 
                  gridArea: note.gridArea
                }}
                onClick={() => handleNoteClick(note.id)}
              >
                <h3 className="font-bold text-lg mb-2 truncate text-blue-800">{note.title}</h3>
                <p className="text-sm overflow-hidden line-clamp-6 text-blue-700">{note.content}</p>
                
                {/* Download button at bottom-left corner - only visible on hover */}
                <button 
                  className="absolute bottom-2 left-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering note click
                    generateWordDocument(note);
                  }}
                  title="Download as Word document"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {notes.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="mb-4">No notes yet for this subject</p>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowNoteForm(true)}
              >
                Create Your First Note
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Fixed plus button glued at the bottom */}
      <div className="fixed bottom-0 right-0 w-full p-4 bg-gradient-to-t from-white to-transparent flex justify-end pointer-events-none">
        <button 
          className="w-12 h-12 flex items-center justify-center z-10 hover:scale-110 transition-transform pointer-events-auto"
          onClick={() => setShowNoteForm(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {/* Floating form for new notes */}
      {showNoteForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-[90%] animate-scale-in">
            <h2 className="text-xl font-bold mb-4">Create New Note</h2>
            <input 
              type="text" 
              value={noteTitle} 
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title"
              className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Start typing your notes here..."
              className="w-full p-2 mb-4 border rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNoteForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={createNewNote}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!noteTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}