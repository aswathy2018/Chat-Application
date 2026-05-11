import Conversation from "../models/Conversation.js"
import User from "../models/User.js"

export const createConversation = async (req, res) => {
    try {
        const { participants } = req.body
        const users = await User.find({ username: { $in: participants } });

        if (users.length !== participants.length) {
            return res.status(404).json({ message: 'One or more users not found' })
        }

        const participantIds = users.map(u => u._id);

        // Checking if conversation already exists between these participants
        const existing = await Conversation.findOne({
            participants: { $all: participantIds, $size: participantIds.length }
        });

        if (existing) {
            return res.status(200).json(existing)
        }

        const newConversation = new Conversation({ participants: participantIds })
        await newConversation.save()

        res.status(201).json(newConversation)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] }
        }).populate('participants', 'username email')

        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}