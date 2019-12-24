const express = require("express");
const router = express.Router();

router.get('/',(req,res)=>{
    //res.send("Página Principal do painel ADM <button ")
    res.render("admin/index");
})

router.get('/posts',(req,res)=>{
    res.send("Página de posts")
})

router.get('/categorias',(req,res)=>{
    res.send("Página de categorias")
})

router.get('/tete',(req,res)=>{
    res.send("isso é um teste")
})


module.exports = router