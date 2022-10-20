const express = require("express")
require("./DB/connection")
const route = require("./Router/router")

const app = express();
app.use(express.json())

app.use("/user", route);

app.listen(3001, ()=>{
    console.log("Server Started at port no 3001");
})