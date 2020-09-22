const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method)
  console.log("Path: ", req.path)
  console.log("Body: ", req.body)
  console.log("---")
  next()
}

app.use(requestLogger)

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

let recipes = [
  {
    id: 1,
    name: "Gluteeniton omenapiirakka",
    ingredients: [
      "Pirkka gluteenitonta vaaleaa jauhoseosta",
      "sokeri",
      "sooda",
      "kanelia",
    ],
    method: [
      "1.Sekoita jauhoseos, sokeri, mantelijauhot ja sooda kulhossa. Sulata voi toisessa kulhossa. Lisää voin joukkoon maito, rahka ja kananmuna. Kaada seos jauhojen joukkoon ja sekoita. Vuoraa vuoka (23 cm × 30 cm) leivinpaperilla ja kaada taikina vuokaan.",
      "2.Leikkaa omenat ohuiksi siivuiksi. Levitä viipaleet taikinan päälle lomittain vieri viereen. Ripottele päälle sokeria ja kanelia.",
      "Paista gluteenitonta omenapiirakkaa 200-asteisessa uunissa keskitasolla noin 20-25 minuuttia.",
    ],
  },
  {
    id: 2,
    name: "Kantarellipasta",
    ingredients: ["kantarelleja", " tagliatellea", "sipuli", "valkosipuli"],
    method: [
      "1.Keitä pasta pakkauksen ohjeen mukaan runsaassa suolassa maustetussa vedessä (n. 2 tl suolaa/2,5 l vettä).",
      "2.Puhdista sienet ja leikkaa ne kuutioiksi. (Jätä muutamia pieniä kokonaisia sieniä halutessasi koristeeksi, paista nämä erikseen öljyssä pannulla.) Kuori ja hienonna sipuli ja valkosipuli.",
      "3.Paista sieniä hetki kuivalla pannulla, kunnes enin neste on haihtunut. Lisää öljy, sipuli ja valkosipuli. Jatka paistamista vielä noin 5 minuuttia, kunnes sipulit ovat pehmenneet ja saaneet hieman väriä.",
      "4.Kaada kerma pannulle, mausta kastike fondilla ja mustapippurilla. Anna kiehua miedolla lämmöllä pari minuuttia. Lisää lopuksi timjami.",
      "5.Valuta pasta, säästä 1 dl keitinvettä. Sekoita kastike, parmesaaniraaste ja sopiva määrä pastan keitinvettä pastan joukkoon. Tarjoa heti parmesaaniraasteen kanssa. Koristele annokset paistetuilla kantarelleilla ja tuoreella timjamilla.",
    ],
  },
]

app.get("/", (req, res) => {
  res.send("<h1>Hello world!</h1>")
})

app.get("/api/recipes", (req, res) => {
  res.json(recipes)
})

app.get("/api/recipes/:id", (request, response) => {
  const id = Number(request.params.id)
  const recipe = recipes.find((r) => {
    return r.id === id
  })

  if (recipe) {
    response.json(recipe)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = recipes.length > 0 ? Math.max(...recipes.map((r) => r.id)) : 0

  return maxId + 1
}

app.post("/api/recipes", (req, res) => {
  const body = req.body

  console.log(body)

  if (!body.name) {
    return res.status(400).json({ error: "name missing" })
  }

  const recipe = {
    name: body.name,
    ingredients: body.ingredients,
    method: body.method,
    id: generateId(),
  }

  recipes = recipes.concat(recipe)
  res.json(recipes)
})

app.delete("/api/recipes/:id", (req, res) => {
  const id = Number(req.params.id)
  recipes = recipes.filter((r) => r.id !== id)
  res.status(204).end()
})
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
