if(process.env.NODE_ENV == "production"){
    //producao
    module.exports = {mongoURI: "mongodb+srv://jessica:blogapp6@blogapp-prod-reh51.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else{
    //desenvolvimento
    module.exports = {mongoURI: "mongodb://localhost/blogapp"} 
}
