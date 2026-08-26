const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();

connectDB()

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    try{
        console.log(`Server is running on port ${PORT}`)
    }catch(err){
        console.log("Server is stopped", err)
    }
})
