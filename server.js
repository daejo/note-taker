//* To Create heroku app = heroku create *//
//      git add -A
//      git commit -m "Add Heroku"
//      git push heroku main:master
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./db/db.json')
const app = express();
const fs = require("fs");
const uniqid = require('uniqid'); // npm install uniqid


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
    res.sendFile(path.join(__dirname, "/db/db.json")) // where the notes are being retrieved from
});

app.post("/api/notes", function(req, res) {

    let newNote = req.body; //sets the format of your objects
    let newID = uniqid(); //creates unique ID for your objects
    newNote.id = newID; //sets unique ID for your objects

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

// Delete Notes
app.delete('/api/notes/:id', (req, res) => {
    db.splice(req.params.id, 1); 
    res.json({ok:true});
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify( db, null, 2)
    );
    return db;
});

app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
})