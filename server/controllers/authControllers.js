const jwt = require('jsonwebtoken')


function generateAccessToken(userId) {
    return jwt.sign(userId, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const sendSessionToken = (req,res,next) => {
    const userId = res.locals.user.data.id
    const redirectTo = res.locals.redirectTo
    const redirectId = res.locals.redirectId

    console.log("redirectTo : ", redirectTo)

    const sessionToken = generateAccessToken({ userId });
    res.cookie('sessionToken', sessionToken, {
        httpOnly: true,
        secure: false, // Devrait être false en développement HTTP
        sameSite: 'Lax', // Peut être 'Lax' ou 'Strict', selon vos besoins
        path: '/' // Assurez-vous que le chemin est correct
      });
    console.log(`${process.env.CLIENT_URL}/${redirectTo}`)
    if(redirectId){
        res.redirect(`${process.env.CLIENT_URL}/${redirectTo}?id=${redirectId}`)
    }
    res.redirect(`${process.env.CLIENT_URL}/${redirectTo}`)
}

const isSessionValide = (req,res,next) => {
    const token = req.query.token ||
                    req.headers['x-access-token'] ||
                    req.cookies.sessionToken;

    console.log(token)
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        console.log("succès")
        res.sendStatus(200)
    })
}

const isSessionValideMidlleware = (req,res,next) => {
    const token = req.query.sessionToken ||
        req.headers['x-access-token'] ||
        req.cookies.sessionToken;
        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            res.locals.userId = user.userId // garde la valeur de l'id pour le controller suivant
            next()
        })
}

module.exports = { sendSessionToken, isSessionValide, isSessionValideMidlleware }