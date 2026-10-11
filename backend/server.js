const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

app.use("/uploads", express.static(uploadFolder));

mongoose.connect("mongodb://127.0.0.1:27017/daynotes")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const journalSchema = new mongoose.Schema({
    title: String,
    date: String,
    mood: String,
    content: String,
    photo: String
});

const Journal = mongoose.model("Journal", journalSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post("/journals", upload.single("photo"), async (req, res) => {
    try {
        const journal = new Journal({
            title: req.body.title,
            date: req.body.date,
            content: req.body.content,
            photo: req.file ? "/uploads/" + req.file.filename : ""
        });

        await journal.save();
        res.json(journal);
    } catch (error) {
        res.status(500).json({ message: "Unable to save journal" });
    }
});

app.get("/journals", async (req, res) => {
    const journals = await Journal.find().sort({ _id: -1 });
    res.json(journals);
});

app.delete("/journals/:id", async (req, res) => {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: "Journal deleted" });
});
app.put("/journals/:id", upload.single("photo"), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            date: req.body.date,
            mood: req.body.mood,
            content: req.body.content
        };

        if (req.file) {
            updateData.photo = "/uploads/" + req.file.filename;
        }

        const journal = await Journal.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!journal) {
            return res.status(404).json({ message: "Journal not found" });
        }

        res.json(journal);
    } catch (error) {
        res.status(500).json({ message: "Unable to update journal" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});