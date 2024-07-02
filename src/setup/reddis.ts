import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()


const setReddis=async()=>{

    try {
        if(!process.env.REDIS_URL){
            throw new Error('Redis URL not found')
        }
        const reddisClient=new Redis(process.env.REDIS_URL)
        return reddisClient
    } catch (error) {
        console.log(error)
    }
}

export default setReddis
