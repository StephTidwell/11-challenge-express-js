const util = require("util");
const fs = require("fs");
const uuid = require("uuid").v1;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  read() {
    return readFileAsync("db/db.json", "utf8"); //how to read database and what character set should be used to reead it
  }

  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }

  addNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("title and text cant be blank");
    }

    const newNote = { title, text, id: uuid() }; //make certain each one has a unique id

    return this.getNotes()
      .then((notes) => [...notes, newNote])
      .then((upDatedNotes) => this.write(upDatedNotes))
      .then(() => this.newNote);
  }

  getNotes() {
    return this.read().then((notes) => {
      return JSON.parse(notes) || [];
    });
  }

  removeNote(id) {
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((keepNotes) => this.write(keepNotes));
  }
}

module.exports = new Store();
