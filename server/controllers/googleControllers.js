require('dotenv').config();
const {google} = require('googleapis');



const getAuth2GoogleUrl = (req,res) => {
    const { query, params } = req
    console.log(query, params)
    const whereGo = req.params.whereGo
    const whichId = req.query.id
    let redirectPath = whereGo
    if(whichId) {
        redirectPath = `${whereGo}?id=${whichId}`
    }

    console.log(redirectPath)

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.SERVER_URL}/auth/google/callback`
    );
    
    const scopes = [
        'https://www.googleapis.com/auth/drive',
        'profile',
        'openid',
        'email',
    ];
    
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',  // Obtenir un refresh_token à la premiere connexion
        scope: scopes
    });
    
    const state = encodeURIComponent(JSON.stringify({ redirectTo: redirectPath}));
    let final_url = `${url}&state=${state}`

    console.log(final_url)
    res.redirect(final_url)      
}

const googleAuthCallBack = async (req, res, next) => {
    const { state } = req.query;
    const { redirectTo } = JSON.parse(decodeURIComponent(state));
    console.log("etapes 2", redirectTo)
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.SERVER_URL}/auth/google/callback`
    );
    const code = req.query.code;  // Extraction du code depuis la query string
    if (!code) {
        console.error('Code de redirection manquant.');
        return res.status(400).send('Code de redirection manquant.');
    }
    try {
        const {tokens} = await oauth2Client.getToken(code);  // Échange du code pour obtenir les tokens
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const userInfo = await oauth2.userinfo.get(); // on récupère les informations de l'utilisarteur
        
        res.locals.user = userInfo
        res.locals.tokens = tokens
        res.locals.redirectTo = redirectTo

        next()

    } catch (err) {
        console.error('Error retrieving tokens:', err);
        res.redirect(`${process.env.CLIENT_URL}/404`)
    }
  }

module.exports = { getAuth2GoogleUrl , googleAuthCallBack};