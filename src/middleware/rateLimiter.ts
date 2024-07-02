import {rateLimit} from 'express-rate-limit'


const limiter=rateLimit({
    windowMs:10*60*1000, //10min
    limit:100, //100 request in 10 min
    standardHeaders:'draft-6',  
    legacyHeaders:false,
})


export default limiter