/*
const http    = require('http')
const Express = require('express')
const MongoDb = require('mongodb')
const fs      = require('fs')
const EJS     = require('ejs')
const login   = require('./login.js')

var app = Express()
app.set('view engine','ejs')
app.use('/assets', Express.static('assets'))
app.use('/resorces/images', Express.static('/resorces/images'))

login(app)

app.listen(3000, ()=>
{
    console.log('Running server.....')
})
*/
/*
const http       = require('http')
const Express    = require('express')
const MongoDb    = require('mongodb')
const fs         = require('fs')
const EJS        = require('ejs')
const bodyParser = require('body-parser')
const mongoose   = require('mongoose')
const socIo      = require('socket.io')

var app              = Express()
var Server           = http.createServer(app)
var io               = socIo(Server)
var PORT             = process.env.PORT || 3000
var urlencodedparser = bodyParser.urlencoded({extended : false})
var socketMap = []
var sent      = false;

app.set('view engine','ejs')
app.use('/assets', Express.static('assets'))
app.use('/resorces/images', Express.static('/resorces/images'))

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
                    //console.log(data)
                    currentName = req.body.logInUsername
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
    //console.log(req.body)
})

app.post('/chatBox', urlencodedparser, (req, res)=>
{
    var name = req.body.currentUser
    console.log('Current user :' + name)
    var arr = profileCollection.find({},(error, data) =>
    {
        res.render('chatBox', {obj: data, user : name})
        //console.log(data)
        //console.log(data.length)
    })
    //console.log(req.body)
})

io.on('connection', (socket)=>
{
    //console.log(socket)
    var rcvr
    var user
    socket.on('detectUser',(name)=>
    {
        socketMap.push({userName : name, userId : socket.id})
        user = name
        console.log(name + ' connected...')
        console.log(socketMap)
    })

    socket.on('selectReceiver',(receiver)=>
    {
        rcvr = receiver
        console.log(receiver + " is receiver...")
    })

    socket.on('chat message', (msg)=>
    {
        console.log(msg)
        for(var i = 0; i < socketMap.length ; i++)
        {
            if(socketMap[i].userName == rcvr)
            {
                io.to(socketMap[i].userId).emit('chat message',msg.user + ' : ' + msg.msg)
                sent = true;
            }
        }
        console.log("Sent : " + sent);
        for(var i = 0; i < socketMap.length ; i++)
        {
            if(socketMap[i].userName == user)
                io.to(socketMap[i].userId).emit('chat message',msg.user + ' : ' + msg.msg)
        }
    })

    socket.on('disconnect', () =>
    {
        socketMap = socketMap.filter((value, index, array)=>
        {
            return value.userName != user
        })
        io.emit('chat message', '<i>' + user + '</i>' + ' is disconnecting...')
        console.log('One user disconnected...')
        console.log(socketMap)
    })
})

Server.listen(PORT, ()=>
{
    console.log('Listening to port now :' + PORT)
})
*/



const http       = require('http')
const Express    = require('express')
const MongoDb    = require('mongodb')
const fs         = require('fs')
const EJS        = require('ejs')
const bodyParser = require('body-parser')
const mongoose   = require('mongoose')
const socIo      = require('socket.io')

var app              = Express()
var Server           = http.createServer(app)
var io               = socIo(Server)
var PORT             = process.env.PORT || 3000
var urlencodedparser = bodyParser.urlencoded({extended : false})
var socketMap = []
var sent      = false;

app.set('view engine','ejs')
app.use('/assets', Express.static('assets'))
app.use('/resorces/images', Express.static('/resorces/images'))

mongoose.connect('mongodb+srv://Taufiq:anikapochameye@cluster0-aeqya.mongodb.net/chatIt?retryWrites=true&w=majority',{ useNewUrlParser: true })
var profileSchema = new mongoose.Schema({
    username: String,
    pass: String,
    rePass: String,
    email: String
})

var pendingSchema = new mongoose.Schema(
    {
        user : String,
        receiver : String,
        message : String
    }
)
var profileCollection = mongoose.model('profileCollection', profileSchema)
var pendingCollection = mongoose.model('pendingCollection', pendingSchema)

app.get('/', (req, res)=>
{
    res.render('index', {errorMessage : ''})
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
                    //console.log(data)
                    currentName = req.body.logInUsername
                }
                else
                {
                    res.render('index',{errorMessage : "Profile does not exist...."})
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
    //console.log(req.body)
})

app.post('/chatBox', urlencodedparser, (req, res)=>
{
    var name = req.body.currentUser
    console.log('Current user :' + name)
    var arr = profileCollection.find({},(error, data) =>
    {
        if(error)
            throw error
        res.render('chatBox', {obj: data, user : name})
        //console.log(data)
        //console.log(data.length)
    })
    //console.log(req.body)
})

io.on('connection', (socket)=>
{
    //console.log(socket)
    var rcvr
    var user
    socket.on('detectUser',(name)=>
    {
        socketMap.push({userName : name, userId : socket.id})
        user = name
        console.log(name + ' connected...')
        console.log(socketMap)
        pendingCollection.find(
            {
                receiver : user
            },
            (error, data)=>
            {
                if(error)
                    throw error;
                if(data.length >= 1)
                {
                    console.log(data)
                    for(var i = 0; i < socketMap.length ; i++)
                    {
                        if(socketMap[i].userName == user)
                        {
                            console.log("Username in SOCMAP")
                            for(var j = 0; j < data.length; j++)
                                io.to(socketMap[i].userId).emit('chat message',data[j].user + ' : ' + data[j].message)
                            pendingCollection.deleteMany({receiver : user},(error)=>
                            {
                                if(error)
                                    throw error
                            })
                        }
                    }
                }
                else
                {
                    console.log('No Pending')
                }
            }
        )
    })

    socket.on('selectReceiver',(receiver)=>
    {
        rcvr = receiver
        console.log(receiver + " is receiver...")
    })

    socket.on('chat message', (msg)=>
    {
        sent = false
        console.log(msg)
        for(var i = 0; i < socketMap.length ; i++)
        {
            if(socketMap[i].userName == rcvr)
            {
                io.to(socketMap[i].userId).emit('chat message',msg.user + ' : ' + msg.msg)
                sent = true;
            }
        }
        console.log("Sent : " + sent);
        if(!sent)
        {
            var str = msg.msg
            pendingCollection({user : user, receiver : rcvr, message : str}).save((error)=>
            {
                if(error)
                    throw error;
                else
                    console.log({user, rcvr, str})
            })
        }
        for(var i = 0; i < socketMap.length ; i++)
        {
            if(socketMap[i].userName == user)
                io.to(socketMap[i].userId).emit('chat message',msg.user + ' : ' + msg.msg)
        }
    })

    socket.on('disconnect', () =>
    {
        socketMap = socketMap.filter((value, index, array)=>
        {
            return value.userName != user
        })
        if(typeof user != "undefined")
            io.emit('chat message', '<i>' + user + '</i>' + ' is disconnecting...')
        console.log('One user disconnected...')
        console.log(socketMap)
    })
})

Server.listen(PORT, ()=>
{
    console.log('Listening to port now :' + PORT)
})