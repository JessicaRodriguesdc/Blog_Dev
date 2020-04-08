if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://jessica:blogapp6@blogapp-prod-reh51.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"} 
}
