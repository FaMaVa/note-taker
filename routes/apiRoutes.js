const route = require('express').Router();

const fsUtils = require('../helpers/fsUtils');
const readAndAppend = fsUtils.readAndAppend;
const readAndDelete = fsUtils.readAndDelete;
const readFromFile = fsUtils.readFromFile;

const { v4: uuidv4 } = require('uuid');

// Get request for notes
route.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Post request for submitting note
route.post('/notes', (req, res) => {

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    console.log(req.body);

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuidv4()
        }
        // Read db.json file and push new note into data
        readAndAppend(newNote, 'db/db.json');

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

// Delete request for notes
route.delete('/notes/:id', (req, res) => {
    if (typeof(req.params.id) == "string") {
        const deletedId = req.params.id;
        readAndDelete(deletedId, 'db/db.json');

        const response = {
            status: 'success',
            body: deletedId + "deleted",
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note!');
    }
});

module.exports = route;