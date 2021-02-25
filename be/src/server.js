const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")
const express = require("express")
const listEndpoints = require("express-list-endpoints")
const { join } = require("path")
const cors = require("cors")

const passport = require("passport")
const cookieParser = require("cookie-parser")
const oauth = require("./services/auth/oauth")

const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling")

const server = express()

const articlesRouter = require("./services/Articles")
const authorsRouter = require("./services/Author")
const port = process.env.PORT || 3002
const publicFolderPath = join(__dirname, "../public")

const whitelist = ["http://localhost:3000", "http://localhost:3001"]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

server.use(cors(corsOptions))
server.use(express.json())
server.use(express.static(publicFolderPath))
server.use(cookieParser())
server.use(passport.initialize())

server.use("/articles", articlesRouter)
server.use("/authors", authorsRouter)

// ERROR HANDLERS

// server.use(notFoundHandler)
// server.use(unauthorizedHandler)
// server.use(forbiddenHandler)
// server.use(catchAllHandler)

console.log(listEndpoints(server))

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch(err => console.log(err))