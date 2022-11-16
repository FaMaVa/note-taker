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

// 
app.get('/api/notes', (req, res) => res.json(notesData));

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));