const express = require("express")
const router = express.Router()
const AuthorModel = require("./AuthorsSchema")

const { authenticate } = require("../auth/tools")
const { authorize } = require("../auth/middleware")

const passport = require("passport")

router.get("/", authorize,  async(req, res, next) => {
    try{
        const authors = await AuthorModel.find(req.query)
        res.send(authors)
    } catch(error){
        console.log('get all', error)
        next(error)
    }
})

router.get("/me", authorize, async (req, res, next) => {
  try {
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})

router.put("/me", authorize, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body)
    updates.forEach(update => (req.author[update] = req.body[update]))
    await req.author.save()
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})

router.delete("/me", authorize, async (req, res, next) => {
  try {
    await req.author.deleteOne(res.send({"_id: ": req.author._id}))
  } catch (error) {
    next(error)
  }
})

router.post("/register", async (req, res, next) => {
  try {
    const newUser = new AuthorModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

router.get("/:id", authorize, async(req, res, next) => {
    try{
        const id = req.params.id;
        const author = await AuthorModel.findById(id)
        if(author){
            res.send(author)
        } else {
            next('some error')
        }
    } catch (error){
        console.log('get id: ', error)
        next(error)
    }
})

router.post("/login", async (req, res, next) => {
  try {
    const { name, password } = req.body
    const user = await AuthorModel.findByCredentials(name, password)
    const tokens = await authenticate(user)
    res.send(tokens)
  } catch (error) {
    console.log('login: ', error)
    next(error)
  }
})


router.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      res.cookie("accessToken", req.author.tokens.accessToken, {
        httpOnly: true,
      })
      // res.cookie("refreshToken", req.author.tokens.refreshToken, {
      //   httpOnly: true,
      //   path: "/users/refreshToken",
      // })

      res.status(200).redirect("http://localhost:3000/")
    } catch (error) {
      console.log('google redirect: ', error)
      next(error)
    }
  }
)


module.exports = router
