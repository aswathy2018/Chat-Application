import User from "../models/User.js"

export const createConversation = async (req, res) => {
    try {
        const {participants} = req.body

        const user = await User.findOne({username: {$in: participants}});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}