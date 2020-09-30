const recipesRouter = require("express").Router()
const Recipe = require("../models/recipe")

recipesRouter.get("/", (req, res) => {
  Recipe.find({}).then((recipes) => {
    res.json(recipes)
  })
})

recipesRouter.get("/:id", (request, response, next) => {
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

recipesRouter.post("/", async (req, res) => {
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

recipesRouter.delete("/:id", (req, res, next) => {
  Recipe.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

recipesRouter.put("/:id", (request, response, next) => {
  const body = request.body

  const recipe = {
    content: body.content,
    important: body.important,
  }

  Recipe.findByIdAndUpdate(request.params.id, recipe, { new: true })
    .then((updatedRecipe) => {
      response.json(updatedRecipe)
    })
    .catch((error) => next(error))
})

module.exports = recipesRouter
