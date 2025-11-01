import { rateLimit } from 'express-rate-limit'
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, //in one minute
    limit: 3, // limit is three 
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req: any, res: any) {
        const generatedTime = req.rateLimit.resetTime;
        const currentTime = Date.now();
        const leftTime = Math.ceil((generatedTime - currentTime) / 1000) //it will give remaining time in seconds
        res.send({ success: 'false', code: 429, message: `Limit Exceed!, please try again after ${leftTime} Seconds`, error: true })
    }
})

export default limiter