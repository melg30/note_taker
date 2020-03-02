// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;
let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Routes
// =============================================================

// return index.html
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// return notes.html
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// read db.json file and return all saved notes as JSOn
app.get("/api/notes", function(req, res) {
  return res.json(data);
});

// receive new note to save on the request body, add it to the `db.json` file
app.post("/api/notes", function(req, res) {
  data.push(req.body);
  fs.writeFile("./db/db.json", JSON.stringify(data), function(err) {
    if (err) throw err;
    console.log("New post successful!");
  });
  return res.json(data);
});

// remove note
app.delete("/api/notes/:id", function(req, res) {
  data = data.filter(function(data) {
    if (req.params.id === data.id) {
      return false;
    }
    return true;
  });

  res.writeFile("./db/db.json", JSON.stringify(data), function(err) {
    if (err) throw err;
    console.log("Note successfully deleted!");
  });
  return res.json(data);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
