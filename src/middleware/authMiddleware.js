import jwt from 'jsonwebtoken';

export const verifyToken = async(req, res, next)=>{
    try{
        //get the token from the header
            const authHeader = req.headers.authorization;
            if(!authHeader)
            {
                return res.status(401).json({
                    message: "No Token provided!"
                })
            }
        //extract the token
            const token = authHeader.split(' ')[1];
        //verify the token
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload;
            next();
    }catch(err)
    {
        return res.status(401).json({
            message: "Invalid or expired token!"
        })
    }
}