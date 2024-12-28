import express from 'express'
import { addFood, getFood } from '../controllers/foodContoller.js';
import multer from 'multer'

const foodRoute = express.Router()

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage });

foodRoute.post('/add-food', upload.single("image"), addFood);
foodRoute.get('/get-food', getFood);

export default foodRoute;