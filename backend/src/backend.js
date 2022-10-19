const express = require("express")
const app = express()

app.use(express.static("public"))

const userRouter = require('./routes/users')

app.use("/users", userRouter)

app.listen(3001)