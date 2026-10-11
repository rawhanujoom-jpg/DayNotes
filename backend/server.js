require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Upload folder
const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Serve uploaded photos
app.use("/uploads", express.static(uploadFolder));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });

// Journal schema
const journalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ""
    }
});

const Journal = mongoose.model("Journal", journalSchema);

// Photo storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, Date.now() + extension);
    }
});

const upload = multer({ storage: storage });

// CREATE a journal
app.post("/journals", upload.single("photo"), async (req, res) => {
    try {
        const journal = new Journal({
            title: req.body.title,
            date: req.body.date,
            mood: req.body.mood,
            content: req.body.content,
            photo: req.file ? "/uploads/" + req.file.filename : ""
        });

        await journal.save();

        res.status(201).json(journal);
    } catch (error) {
        console.error("Error saving journal:", error.message);
        res.status(500).json({
            message: "Unable to save journal"
        });
    }
});

// READ all journals
app.get("/journals", async (req, res) => {
    try {
        const journals = await Journal.find().sort({ _id: -1 });
        res.json(journals);
    } catch (error) {
        console.error("Error fetching journals:", error.message);
        res.status(500).json({
            message: "Unable to fetch journals"
        });
    }
});

// UPDATE a journal
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
            {
                new: true,
                runValidators: true
            }
        );

        if (!journal) {
            return res.status(404).json({
                message: "Journal not found"
            });
        }

        res.json(journal);
    } catch (error) {
        console.error("Error updating journal:", error.message);
        res.status(500).json({
            message: "Unable to update journal"
        });
    }
});

// DELETE a journal
app.delete("/journals/:id", async (req, res) => {
    try {
        const journal = await Journal.findByIdAndDelete(req.params.id);

        if (!journal) {
            return res.status(404).json({
                message: "Journal not found"
            });
        }

        res.json({
            message: "Journal deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting journal:", error.message);
        res.status(500).json({
            message: "Unable to delete journal"
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});