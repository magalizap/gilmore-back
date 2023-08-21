import mongoose from "mongoose";
import config from "./envConfig.js";
import { logger } from "../middlewares/logger.js";

const URL = config.mongo_url

mongoose.connect(URL)
.then(() => logger.info('🖥️  DB is connected'))
.catch((error) => logger.error('Error en MongoDB Atlas:', error))