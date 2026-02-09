const express = require('express')
const notesModel = require('../src/models/notes.model')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('public'))


app.post('/notes', async(req, res) => {
    const {title, description} = req.body;
    const note = await notesModel.create({
        title,
        description
    })
    res.status(201).json({
        "message": "Note Created Successfully",
        note
    })
})

app.get('/notes', async(req, res) => {
    const notes = await notesModel.find()
    res.status(200).json({
        "message": "Notes Fetched Successfully",
        notes
    })
})

app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await notesModel.findByIdAndDelete(id);
        
        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: 'Note not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Note deleted successfully',
            data: note 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting note', 
            error: error.message 
        });
    }
});

app.patch('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;  
        const { title, description } = req.body; 
        const note = await notesModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }  
        );
        
        if (!note) {
            return res.status(404).json({ 
                message: 'Note not found' 
            });
        }
        
        res.status(200).json({ 
            message: 'Note updated successfully',
            note: note
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating note', 
            error: error.message 
        });
    }
});


app.get('*notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = app