import bcrypt from "bcrypt"
import express, { json } from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import "dotenv/config"
import connectDB from "./db/dbconnect.js"
import UserModel from "./models/user.model.js"
import authenticateToken from "./utilites.js"
import TravelStoryModel from "./models/travel.model.js"
import upload from "./multer.js"
import path from "path"
import fs from "fs"

connectDB()

const app = express()
const PORT = process.env.PORT || 3000
const HOSTNAME = process.env.HOSTNAME || "http://localhost"

app.use(express.json())
app.use(cors({ origin: "*" }))
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))
app.use("/assets", express.static(path.join(process.cwd(), "assets")))

// create account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        return res.status(404).json({
            error: true,
            message: "All Field Required"
        })
    }

    const isUser = await UserModel.findOne({ email })

    if (isUser) {
        return res.status(400).json({
            error: true,
            message: "User already exist"
        })
    }

    const hasedPassword = await bcrypt.hash(password, 10)

    const user = new UserModel({
        fullName, email, password: hasedPassword
    })

    await user.save()

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "100h" });

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Registration Successful"
    })
})

// health-check
app.get("/health", async (req, res) => {
    return res.status(200).json({ message: "All Good" })
})


// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({
            error: true,
            message: "All Field Required"
        })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            error: true,
            message: "User not exist"
        })
    }

    const ispasswordValid = await bcrypt.compare(password, user.password)

    if (!ispasswordValid) {
        return res.status(400).json({
            error: true,
            message: "Email or password incorrect"
        })
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "100h" });

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Login Successful"
    })

})

// get user
app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user

    const isUser = await UserModel.findOne({ _id: userId })

    if (!userId) {
        return res.sendStatus(401)
    }
    return res.json({
        user: isUser,
        message: "Added Successfully"
    })
})

app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body
    const { userId } = req.user

    if (!title || !story || !visitedDate || !visitedLocation || !imageUrl) {
        return res.status(400).json({
            error: true, message: "All fields are required"
        })
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate))

    try {
        const travelStory = new TravelStoryModel({
            title, story, visitedLocation, userId, imageUrl, visitedDate: parsedVisitedDate
        })

        await travelStory.save()
        res.status(200).json({ story: travelStory, message: "Added Successfully" })
    } catch (error) {
        res.status(400).json({ error: true, message: error.message })
    }

})

app.get("/get-all-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user

    try {
        const travelStories = await TravelStoryModel.find({ userId: userId }).sort({ isFavourite: -1 })
        res.status(200).json({ stories: travelStories })

    } catch (error) {
        res.status(400).json({ error: true, message: error.message })

    }
})

app.post("/image-upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: "No image uploaded" })
        }
        const imageUrl = `${HOSTNAME}/uploads/${req.file.filename}`
        res.status(200).json({ imageUrl })
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })

    }
})


app.delete("/delete-image", async (req, res) => {
    const { imageUrl } = req.query;
    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "Invalid Parameter" })
    }

    try {
        const filename = path.basename(imageUrl)
        const filePath = path.join(process.cwd(), "uploads", filename)

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            res.status(200).json({ message: "Image delted Successfully" })
        }
        else {
            res.status(200).json({ message: "Image not found" })
        }

    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
})

app.put("/edit-travel-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body
    const { userId } = req.user

    if (!title || !story || !visitedDate || !visitedLocation) {
        return res.status(400).json({
            error: true, message: "All fields are required"
        })
    }
    const parsedVisitedDate = new Date(parseInt(visitedDate))

    try {

        const travelStory = await TravelStoryModel.findOne({ _id: id, userId: userId })
        if (!travelStory) {
            res.status(404).json({ error: true, message: "Story not found" })
        }

        const placeholderImgUrl = `${HOSTNAME}/assets/placeholder.png`



        travelStory.title = title
        travelStory.story = story
        travelStory.visitedLocation = visitedLocation
        travelStory.visitedDate = parsedVisitedDate
        travelStory.imageUrl = imageUrl || placeholderImgUrl


        await travelStory.save()
        res.status(200).json({ story: travelStory, message: "Upadate Done" })

    } catch (error) {
        res.status(500).json({ error: true, message: error.message })

    }

})

app.delete("/delete-travel-story/:id", authenticateToken, async (req, res) => {

    const { id } = req.params
    const { userId } = req.user

    try {
        const travelStory = await TravelStoryModel.findOne({ _id: id, userId: userId })

        if (!travelStory) {
            res.status(404).json({ error: true, message: "Story not found" })
        }

        await travelStory.deleteOne({ _id: id, userId: userId })

        const imageUrl = travelStory.imageUrl
        const filename = path.basename(imageUrl)
        const filePath = path.join(process.cwd(), "uploads", filename)

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Failed To delete Image", err)
            }
        })

        res.status(200).json({ story: travelStory, message: "Story deleted Successfully" })

    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
})

app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params
    const { userId } = req.user
    const { isFavourite } = req.body

    try {
        const travelStory = await TravelStoryModel.findOne({ _id: id, userId: userId })
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Story not found" })
        }

        travelStory.isFavourite = isFavourite
        await travelStory.save()
        res.status(200).json({ story: travelStory, message: "Update successful" })


    } catch (error) {
        res.status(500).json({ error: true, message: error.message })

    }
})

app.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query
    const { userId } = req.user

    if (!query) {
        return res.status(404).json({ error: true, message: "query is required" })

    }

    try {
        const searchResult = await TravelStoryModel.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavourite: -1 })


        res.status(200).json({ stories: searchResult })


    } catch (error) {
        res.status(500).json({ error: true, message: error.message })

    }
})

app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query
    const { userId } = req.user

    try {
        const start = new Date(parseInt(startDate))
        const end = new Date(parseInt(endDate))

        const filteredStories = await TravelStoryModel.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end },
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: filteredStories })

    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`backend running at ${HOSTNAME}:${PORT}`)
})