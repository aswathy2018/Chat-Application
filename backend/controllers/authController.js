import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    const { username, email, password } = req.body

    try {
        const existing = await User.findOne({ $or: [{ username }, { email }] });

        if (existing) {
            return res.status(400).json({ message: 'Username or email already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ username, email, password: hashedPassword })

        await newUser.save()

        res.status(201).json({ message: 'User created successfully!!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body

    try {
        const existing = await User.findOne({ username });

        // BUG FIX: was checking `if (existing)` and returning 400 — should check if NOT found
        if (!existing) {
            return res.status(400).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, existing.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: existing._id, username: existing.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // BUG FIX: was `expairesIn` (typo) → `expiresIn`
        )

        res.status(200).json({ token, userId: existing._id })  // BUG FIX: was 201 (Created) → 200 (OK) for login
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}