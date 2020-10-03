const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./db/db.json')
const app = express();
const fs = require("fs");
const uniqid = require('uniqid'); // npm install iniqid

// --- MIDDLEWARE ---
// ===================================
// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
// serve static files
app.use(express.static('public'))
// ===================================

// --- HTML  ROUTES  ---
// ==================================

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// ===================================

app.get('/api/notes', (req,res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
});

app.post("/api/notes", function(req, res) {

    let newNote = req.body;
    let newID = uniqid();
    newNote.id = newID;

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        const dbFile = JSON.parse(data);
        dbFile.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(dbFile), "utf8", err => {
            if (err) throw err;
            console.log("The data has been saved to the file!")
        });
    });
    res.redirect("/notes");
})

app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
})