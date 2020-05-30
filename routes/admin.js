const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios") 
const {eAdmin}= require("../helpers/eAdmin")


router.get('/',eAdmin,(req,res)=>{
    //res.send("Página Principal do painel ADM <button ")
    res.render("admin/index");
})

router.get('/posts',eAdmin,(req,res)=>{
    res.send("Página de posts")
})

//categoria
router.get('/categorias',eAdmin,(req,res)=>{
    //res.send("Página de categorias")
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render("admin/categoria/categorias",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar as categorias!")
        res.redirect("/admin")
    })  
})

router.get('/categorias/add',eAdmin,(req,res)=>{
    res.render("admin/categoria/addcategorias")
})

router.post("/categorias/nova",eAdmin,(req,res)=>{

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
        res.render("admin/categoria/addcategorias",{erros: erros})
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

router.get("/categorias/edit/:id",eAdmin,(req,res)=>{
    //res.send("Página de edição de categoria")
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render("admin/categoria/editcategorias",{categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg","Esta categoria não existe!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit",eAdmin,(req,res)=>{

        
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
                res.render("admin/categoria/editcategoria", { categoria: categoria, erros: erros });
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


router.post("/categorias/deletar",eAdmin, (req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg","Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar categoria!")
        res.redirect("/admin/categorias")
    })
})

//Postagem

router.get('/postagens',eAdmin,(req,res)=>{
    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render("admin/postagem/postagens",{postagens: postagens})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar as postagens!")
        res.redirect("/admin")
    })
})

router.get('/postagens/add',eAdmin,(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render("admin/postagem/addpostagem",{categorias:categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar o formulario")
        req.redirect("/admin")
    })    
})

router.post("/postagens/nova",eAdmin,(req,res)=>{
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }
    if(erros.length > 0){
        res.render("admin/postagem/addpostagem", {erros: erros})
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


router.get("/postagens/edit/:id",eAdmin,(req,res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{

        Categoria.find().then((categorias)=>{

            res.render("admin/postagem/editpostagens",{categorias: categorias , postagem: postagem})

        }).catch((err)=>{
            req.flash("error_msg","Erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((err)=>{
        req.flash("error_msg","Erro ao carregar o formulario de edição")
        res.redirect("/admin/postagens")
    })
    
})



router.post("/postagem/edit",eAdmin,(req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{

        postagem.titulo = req.body.titulo,
        postagem.slug = req.body.slug,
        postagem.descricao = req.body.descricao,
        postagem.conteudo = req.body.conteudo,
        postagem.categoria = req.body.categoria
        
        postagem.save().then(()=>{
            req.flash("success_msg","Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg","Error interno ao salvar a edição!")
            res.redirect("/admin/postagens")
        })
    }).catch((err)=>{
        req.flash("error_msg","Error ao salvar a edição!")
        res.redirect("/admin/postagens")
    })
})


router.get("/postagens/deletar/:id",eAdmin,(req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg","Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletada a postagem!")
        res.redirect("/admin/postagens")
    })
})



router.get('/usuarios',eAdmin,(req,res)=>{
    //res.send("Página de categorias")
    Usuario.find().sort({date:'desc'}).then((usuarios)=>{
        res.render("admin/usuario/usuarios",{usuarios: usuarios})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar os usuarios!")
        res.redirect("/admin")
    })  
})


router.get("/usuarios/edit/:id",eAdmin,(req,res)=>{
    
    Usuario.findOne({_id:req.params.id}).then((usuario)=>{
        res.render("admin/usuario/editusuarios",{usuario: usuario})
    }).catch((err)=>{
        req.flash("error_msg","Esta usuario não existe!")
        res.redirect("/admin/usuarios")
    })
})


router.post("/usuario/edit",eAdmin,(req,res)=>{
    Usuario.findOne({_id: req.body.id}).then((usuario)=>{

        usuario.nome = req.body.nome,
        usuario.email = req.body.email,
        usuario.eAdmin = req.body.eAdmin,
        
        
        usuario.save().then(()=>{
            req.flash("success_msg","Usuario editada com sucesso!")
            res.redirect("/admin/usuarios")
        }).catch((err)=>{
            req.flash("error_msg","Error interno ao salvar a edição!")
            res.redirect("/admin/usuarios")
        })
    }).catch((err)=>{
        req.flash("error_msg","Error ao salvar a edição!")
        res.redirect("/admin/usuarios")
    })
})

router.get("/usuarios/edit-senha/:id",eAdmin,(req,res)=>{
    
    Usuario.findOne({_id:req.params.id}).then((usuario)=>{
        res.render("admin/usuario/editusuariosenha",{usuario: usuario})
    }).catch((err)=>{
        req.flash("error_msg","Esta usuario não existe!")
        res.redirect("/admin/usuarios")
    })
})

router.post("/usuario/edit-senha",eAdmin,(req,res)=>{
    Usuario.findOne({_id: req.body.id}).then((usuario)=>{

         usuario.senha = req.body.senha,
    
            bcryptjs.genSalt(10,(erro,salt)=>{
                bcryptjs.hash(usuario.senha, salt,(erro,hash)=>{
                    if(erro){
                        req.flash("error_msg","Erro durate o salvamento do usuário!")
                        res.redirect("/")
                    }
                    usuario.senha = hash

                    usuario.save().then(()=>{                           
                        req.flash("success_msg","Senha editada com sucesso!")
                        res.redirect("/admin/usuarios")
                    }).catch((err)=>{
                        req.flash("error_msg","Error interno ao salvar a edição!")
                        res.redirect("/admin/usuarios")
                    })
                })
            })
        })
        .catch((err)=>{
        req.flash("error_msg","Error ao salvar a edição!")
        res.redirect("/admin/usuarios")
    })
})

router.post("/usuarios/deletar",eAdmin, (req,res)=>{
    Usuario.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg","Usuario deletada com sucesso!")
        res.redirect("/admin/usuarios")
    }).catch((err)=>{
        req.flash("error_msg","Erro ao deletar o usuario!")
        res.redirect("/admin/usuarios")
    })
})

module.exports = router