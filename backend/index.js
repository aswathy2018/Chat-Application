import express from "express"
import { Server } from "socket.io"
import dotenv from "dotenv"
import http from 'http'
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./routes/auth.js"

const app = express()
dotenv.config()

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const PORT = process.env.PORT || 5005

//Middleware
app.use(cors({origin: "true", credentials: true}))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connection established.."))
  .catch((error) => console.log("Error in connecting mongoDB:", error));

app.use('/api/auth', authRoutes)

io.on('connection', (socket)=>{
    console.log('A user connected');
})

server.listen(PORT, ()=>console.log(`Server is connected on Port ${PORT}`))