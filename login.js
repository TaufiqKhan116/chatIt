module.exports = function login(app, io)
{
    const bodyParser = require('body-parser')
    const mongoose   = require('mongoose')

    const urlencodedparser = bodyParser.urlencoded({extended : false})
    mongoose.connect('mongodb+srv://Taufiq:anikapochameye@cluster0-aeqya.mongodb.net/chatIt?retryWrites=true&w=majority')
    var profileSchema = new mongoose.Schema({
        username: String,
        pass: String,
        rePass: String,
        email: String
    })
    var profileCollection = mongoose.model('profileCollection', profileSchema)
    
    app.get('/', (req, res)=>
    {
        res.render('index')
        console.log(req.url)
        console.log(req.ip)
    })
    app.post('/', urlencodedparser, (req, res)=>
    {
        console.log(req.url)
        if(req.body.submit == 'logIn')
        {
            profileCollection.find(
                {
                    username: req.body.logInUsername,
                    pass: req.body.logInPass
                },
                (error, data)=>
                {
                    if(data.length >= 1)
                    {
                        res.render('redirection',{user : req.body.logInUsername})
                        console.log(data)
                    }
                    else
                    {
                        res.render('index')
                        console.log('Profile dosn\'t exist....')
                    }
                }
            )
        }
        else if(req.body.submit == 'signUp')
        {
            res.render('index')
            var newProfile = profileCollection(req.body).save((error)=>
            {
                if(error)
                    throw error;
                else
                    console.log('New profile added...')
            })
        }
        console.log(req.body)
    })

    app.post('/chatBox', urlencodedparser, (req, res)=>
    {
        var arr = profileCollection.find({},(error, data) =>
        {
            res.render('chatBox', {obj: data})
            console.log(data)
            console.log(data.length)
        })
        console.log(req.body)
    })
}