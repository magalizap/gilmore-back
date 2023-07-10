import mongoose from "mongoose";
import config from "./config.js";

const URL = config.mongo_url

mongoose.connect(URL)
.then(() => console.log('DB is connected'))
.catch((error) => console.log('Error en MongoDB Atlas:', error))