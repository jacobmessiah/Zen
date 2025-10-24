import jwt from 'jsonwebtoken'

const generateJwtToken = (userId, res) => {
    const token = jwt.sign({userId} ,process.env.JWT_SECRET , {
        expiresIn: '7d'
    })
      res.cookie("ZenChattyVerb",token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'Strict',
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"
    })

}

export default generateJwtToken
