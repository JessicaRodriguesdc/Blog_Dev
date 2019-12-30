//Carregando Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")

require("./models/Postagem")
const Postagem = mongoose.model("postagens")

//Configuracoes
     //Sessao
     app.use(session({
         secret: "cursodenodejs",
         resave: true,
         saveUninitialized: true
     }))
     app.use(flash())
     //Middleware
     app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
     })
     // Body Parser
     app.use(bodyParser.urlencoded({ extended: true }));
     app.use(bodyParser.json());
    // Handlebars
     app.engine("handlebars", handlebars({ defaultLayout: "main" }));
     app.set("view engine", "handlebars");
    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp").then(()=>{
        console.log("Conectado ao mongo")
    }).catch((err)=>{
        console.log("Erro ao se conectar: "+err)
    })
    // Public
     app.use(express.static(path.join(__dirname, "public")));  

    /* app.use((req,res,next)=>{
        console.log("oi eu sou um middleware")
        next();
     })*/

//Rotas
    app.get('/',(req,res)=>{
        //res.send("Rota principal")
        Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens)=>{
            res.render("index",{postagens: postagens})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/404")
        })
 
    })

    app.get("/404",(req,res)=>{
        res.send('Erro 404!')
    })

    app.get('/posts',(req,res)=>{
        res.send("Lista Posts")
    })

    app.use('/admin',admin)

//Outras
const PORT = 8082
app.listen(PORT,()=>{
    console.log("Servidor rodando!")
}) 
