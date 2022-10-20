//Connect Mongodb database

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Cluster1:Cluster1@cluster0.mtgfqth.mongodb.net/INBT-Contract-Exchange?retryWrites=true&w=majority")
    .then(() => {
        console.log("Database Connected")
    })
    .catch((err) => {
        console.log(err)
    })