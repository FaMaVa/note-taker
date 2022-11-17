const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const notesData = require('./db/db.json');
const { readAndAppend, readAndDelete } = require('./helpers/fsUtils');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();
const uuid = uuidv4();

app.use(express.json());
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


app.route('/api/notes')
    // Get request for notes
    .get((req, res) => res.json(notesData))



    // Post request for submitting note
    .post((req, res) => {

        // Destructuring assignment for the items in req.body
        const { title, text } = req.body;
        console.log(req.body);

        // If all the required properties are present
        if (title && text) {
            // Variable for the object we will save
            const newNote = {
                title,
                text,
                id: uuid
            }
            // Read db.json file and push new note into data
            readAndAppend(newNote, './db/db.json')
                .then(res.json(notesData));

            const response = {
                status: 'success',
                body: newNote,
            };

            console.log(response);
            res.status(201).json(response);

        } else {
            res.status(500).json('Error in posting note!');
        }
    });

app.delete('/api/notes/:id', (req, res) => {
    const deletedId = req.params.id
    readAndDelete(deletedId, './db/db.json')
        .then(res.json(notesData));

});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));