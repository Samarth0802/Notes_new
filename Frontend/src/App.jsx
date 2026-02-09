import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
    const [notes, setnotes] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDesc, setEditDesc] = useState('')

    // Fetch all notes
    async function fetchedNotes() {
        try {
            const response = await axios.get('https://notes-new-vv4m.onrender.com/notes')
            setnotes(response.data.notes)
        } catch (error) {
            console.error('Error fetching notes:', error)
        }
    }

    // Create new note
    async function submitForm(e) {
        e.preventDefault()
        const title = e.target.title.value
        const description = e.target.desc.value

        try {
            await axios.post('https://notes-new-vv4m.onrender.com/notes', {
                title: title,
                description: description
            })
            e.target.reset() // Clear form
            fetchedNotes() // Refresh notes
        } catch (error) {
            console.error('Error creating note:', error)
        }
    }

    // Delete note
    async function deleteNote(id) {
        try {
            await axios.delete(`https://notes-new-vv4m.onrender.com/notes/${id}`)
            fetchedNotes() // Refresh notes
        } catch (error) {
            console.error('Error deleting note:', error)
        }
    }

    // Update note
    async function updateNote(id) {
        try {
            await axios.patch(`https://notes-new-vv4m.onrender.com/notes/${id}`, {
                title: editTitle,
                description: editDesc
            })
            setEditingId(null) // Exit edit mode
            fetchedNotes() // Refresh notes
        } catch (error) {
            console.error('Error updating note:', error)
        }
    }

    // Start editing
    function startEdit(note) {
        setEditingId(note._id)
        setEditTitle(note.title)
        setEditDesc(note.description)
    }

    // Cancel editing
    function cancelEdit() {
        setEditingId(null)
        setEditTitle('')
        setEditDesc('')
    }

    // Fetch notes on component mount
    useEffect(() => {
        fetchedNotes()
    }, [])

    return (
        <div>
            <form onSubmit={submitForm}>
                <h1>Note's Manager</h1>
                <div className='input-div'>
                    <input 
                        type="text" 
                        placeholder='Enter Title' 
                        id='title'
                        className='title'
                        required
                    />
                    <input 
                        type="text" 
                        placeholder='Enter Description' 
                        id='desc'
                        className='desc'
                        required
                    />
                </div>
                <button type='submit'>Submit</button>
            </form>

            {/* Notes Display */}
            <div className='notes-container'>
                {notes.length === 0 ? (
                    <p className='no-notes'>No notes available. Create one!</p>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} className='note-card'>
                            {editingId === note._id ? (
                                // Edit Mode
                                <div className='edit-mode'>
                                    <input 
                                        type="text" 
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className='edit-input'
                                    />
                                    <input 
                                        type="text" 
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className='edit-input'
                                    />
                                    <div className='edit-buttons'>
                                        <button 
                                            onClick={() => updateNote(note._id)}
                                            className='save-btn'
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={cancelEdit}
                                            className='cancel-btn'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <h3>{note.title}</h3>
                                    <p>{note.description}</p>
                                    <div className='note-actions'>
                                        <button 
                                            onClick={() => startEdit(note)}
                                            className='edit-btn'
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteNote(note._id)}
                                            className='delete-btn'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default App