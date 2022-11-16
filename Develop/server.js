const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const notesData = require('./db/db.json');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();
const uuid = uuidv4();

pp.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Get request for notes
app.get('/api/notes', (req, res) => res.json(notesData));

// Post request for submitting note
app.post('/api/notes', (req, res) => {

    // Destructuring assignment for the items in req.body
    const { title, note } = req.body;

    // If all the required properties are present
    if (title && note) {
        // Variable for the object we will save
        const newNote = {
            title,
            note,
            note_id: uuid
        }
        // Read db.json file and push new note into data
        fs.readFile(notesData, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                // Write the notes with the new note to the db.json
                fs.writeFile(notesData, JSON.stringify(parsedNotes, null, 2),
                    (err) =>
                        err
                            ? console.error(err)
                            : console.log(
                                `Review for ${newNote.title} has been written to JSON file`
                            )
                );
            }
        });
    
        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);

    } else {
        res.status(500).json('Error in posting note!');
    }
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));