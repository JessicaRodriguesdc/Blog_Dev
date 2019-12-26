const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/',(req,res)=>{
    //res.send("Página Principal do painel ADM <button ")
    res.render("admin/index");
})

router.get('/posts',(req,res)=>{
    res.send("Página de posts")
})

router.get('/categorias',(req,res)=>{
    //res.send("Página de categorias")
    res.render("admin/categorias")
})

router.get('/categorias/add',(req,res)=>{
    res.render("admin/addcategorias")
})

router.post("/categorias/nova",(req,res)=>{

    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        console.log("Categoria salva com sucesso!")
    }).catch((err)=>{
        console.log("Erro ao salvar categoria! "+err)
    })

})

router.get('/tete',(req,res)=>{
    res.send("isso é um teste")
})


module.exports = router