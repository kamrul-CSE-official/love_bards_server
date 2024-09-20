import { createClient } from "redis";
import logger from "./logger";
import config from "../config";

let redisCLient = createClient({
    url: config.redis.url
});

redisCLient.on('error', (err)=> logger.error("Redis error", err));
redisCLient.on('connect', (err)=> logger.info("Redis connected"));

const connect = async(): Promise<void> => {
    await redisCLient.connect();
}

export const redisClient = {
    connect
}