import jwt from 'jsonwebtoken'
import tokenBlacklistModel from '../models/blacklist.model.js'

export const authUser = async(req, res, next) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message: "Token is not provided"
        })
    }
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Token is Invalid"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}
