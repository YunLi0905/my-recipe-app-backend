require("dotenv").config()
const http = require("http")

const express = require("express")
const app = express()

const Recipe = require("./models/recipe")
const cors = require("cors")
const { response } = require("express")

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method)
  console.log("Path: ", req.path)
  console.log("Body: ", req.body)
  console.log("---")
  next()
}

app.use(requestLogger)

app.get("/", (req, res) => {
  res.send("<h1>Hello world!</h1>")
})

app.get("/api/recipes", (req, res) => {
  Recipe.find({}).then((recipes) => {
    res.json(recipes)
  })
})

app.get("/api/recipes/:id", (request, response, next) => {
  Recipe.findById(request.params.id)
    .then((r) => {
      if (r) {
        response.json(r)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.post("/api/recipes", async (req, res) => {
  const body = req.body

  console.log(body)

  if (!body.name) {
    return res.status(400).json({ error: "name missing" })
  }

  const recipe = new Recipe({
    name: body.name,
    ingredients: body.ingredients,
    method: body.method,
  })

  const savedRecipe = await recipe.save()

  console.log(savedRecipe, " has been saved")
  res.json(savedRecipe.toJSON)
})

app.delete("/api/recipes/:id", (req, res, next) => {
  Recipe.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.put("/api/recipes/:id", (request, response, next) => {
  const body = request.body

  const recipe = {
    content: body.content,
    important: body.important,
  }

  Recipe.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedRecipe) => {
      response.json(updatedRecipe)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
