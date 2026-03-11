const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get all messages (wrapped for NGO app)
router.get("/", async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all messages for a specific hospital (or all for now if no auth)
router.get("/all", async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new message
router.post("/create", async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json({ message: "Message stored successfully!", data: newMessage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a message
router.delete("/:id", async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
