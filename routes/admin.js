const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

require("../models/Categoria")
const Categoria = mongoose.model("categorias")

require("../models/Postagem")
const Postagem = mongoose.model("postagens") 

router.get('/',(req,res)=>{
    //res.send("Página Principal do painel ADM <button ")
    res.render("admin/index");
})

router.get('/posts',(req,res)=>{
    res.send("Página de posts")
})

router.get('/categorias',(req,res)=>{
    //res.send("Página de categorias")
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render("admin/categorias",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar as categorias!")
        res.redirect("/admin")
    })  
})

router.get('/categorias/add',(req,res)=>{
    res.render("admin/addcategorias")
})

router.post("/categorias/nova",(req,res)=>{

    var erros=[]
    //validacao do formulario
        //verificacao se o nome for vazio ,indefinido ,nulo
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido!"})
    }
    //verificacao se o slug for vazio ,indefinido ,nulo
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug invalido!"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno!"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias",{erros: erros})
    }else{
        //Criando categoria
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(()=>{
            //console.log("Categoria salva com sucesso!")
            req.flash("success_msg","Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
             //console.log("Erro ao salvar categoria! "+err)
            req.flash("error_msg","Erro ao criar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }

})

router.get("/categorias/edit/:id",(req,res)=>{
    //res.send("Página de edição de categoria")
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render("admin/editcategorias",{categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg","Esta categoria não existe!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit",(req,res)=>{

        
    var erros = [];
    // Validação manual de formulario
        //verificacao se o nome for vazio ,indefinido ,nulo
        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ Message: "Nome inválido." });
        }
        
         //verificacao se o slug for vazio ,indefinido ,nulo

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ Message: "Slug inválido." });
        }
    
        if (req.body.nome.length < 2) {
            erros.push({ Message: "Nome da categoria muito pequeno." });
        }
    
        if (erros.length > 0) {
            Categoria.findOne({ _id: req.body.id }).then((categoria) => {
                res.render("admin/editcategoria", { categoria: categoria, erros: erros });
            }).catch((err) => {
                req.flash("error_msg", "Categoria não encontrada!");
                res.redirect("/admin/categorias");
            });
        } else {
            //Editando categoria
            Categoria.findOne({ _id: req.body.id }).then((categoria) => {
                categoria.nome = req.body.nome;
                categoria.slug = req.body.slug;
    
                categoria.save().then(() => {
                    req.flash("success_msg", "A Categoria foi editada com sucesso!")
                    res.redirect("/admin/categorias");
                }).catch((err) => {
                    req.flash("error_msg", "Erro interno ao editar a categoria!");
                    res.redirect("/admin/categorias");
                });
            }).catch((err) => {
                req.flash("error_msg", "Erro ao editar a categoria!");
                res.redirect("/admin/categorias");
            });
        }
})


router.post("/categorias/deletar", (req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg","Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar categoria!")
        res.redirect("/admin/categorias")
    })
})


router.get('/postagens',(req,res)=>{
    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render("admin/postagens",{postagens: postagens})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar as postagens!")
        res.redirect("/admin")
    })
})

router.get('/postagens/add',(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render("admin/addpostagem",{categorias:categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar o formulario")
        req.redirect("/admin")
    })    
})

router.post("/postagens/nova",(req,res)=>{
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }
    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug

        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao criar a postagem!",err)
            res.redirect("/admin/postagens")
        })
    }
})

module.exports = router