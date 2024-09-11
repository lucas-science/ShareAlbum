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
        secure: true, // En production, sécurisé avec HTTPS
        sameSite: 'None', // Nécessaire pour permettre les cookies cross-origin
        path: '/', // Le chemin approprié
        domain: 'share-album-omega.vercel.app', // Domaine du client sur Vercel
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