const mongoose = require("mongoose")

const uniqueValidator = require("mongoose-unique-validator")

mongoose.set("useFindAndModify", false)

const url = process.env.MONGODB_URL

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB")
  })
  .catch((err) => {
    console.log("error connecting to MongoDB", err.message)
  })

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  ingredients: {
    type: Array,
    minlength: 3,
  },
  method: {
    type: Array,
    required: true,
  },
})
RecipeSchema.plugin(uniqueValidator)

RecipeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  },
})

module.exports = mongoose.model("Recipe", RecipeSchema)
