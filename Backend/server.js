import dotenv from 'dotenv'
dotenv.config();
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import app from './src/app.js'
import connectToDB from './src/config/db.js'

connectToDB()
const PORT = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.send("Server is running properly")
})

app.listen(PORT,()=>{
    console.log("Server is running")
})