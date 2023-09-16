import mongoose from "mongoose";
import config from "./env.config.js";
import { logger } from "../middlewares/log/logger.middleware.js";

const URL = config.mongo_url

mongoose.connect(URL)
.then(() => logger.info('🖥️  DB is connected'))
.catch((error) => logger.error('Error en MongoDB Atlas:', error))