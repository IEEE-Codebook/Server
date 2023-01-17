const express = require("express")
const app = express()
const PORT = 5000
const mongoose = require("mongoose")
const {MONGOURI} = require("./key")

mongoose.connect(MONGOURI)
mongoose.connection.on('connected', ()=>{
    console.log("Mongoose connection done")
})
mongoose.connection.on('error', (err)=>{
    console.log("ERROR:( ", err)
})

require("./models/user") //not exporting so no variable

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/user"))


app.listen(PORT, () => {
    console.log("server working on port ", PORT)
})