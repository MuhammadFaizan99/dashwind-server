require("dotenv").config()
const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")
const PORT = process.env.PORT || 5173;
const {dbConnect} = require("./connection")
const {userRouter} = require("./routes/userRoutes")
const {paymentRouter} = require("./routes/paymentRoutes")

// middleware
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(cors())

// DB Connection
dbConnect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB connection successfull")
}).catch((e)=>{
    console.log("No DB connection "+e)
})
// routes
app.use("/users",userRouter)
app.use("/payments",paymentRouter)

// Server Connection
app.listen(PORT,(()=>{
    console.log(`Listening on ${PORT}`)
}))