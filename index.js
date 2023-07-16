require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')


morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    Person
      .find({})
      .then(result => res.json(result))
  })

app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p> 
    <p>${new Date}</p>
    `)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person
      .findById(id)
      .then(person => {
        if (note) {
          res.json(person)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).end()
      })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    
    Person
      .findByIdAndRemove(id)
      .then(result => {
        res.status(204).end()
      })
      .catch(err => {
        next(err)
      })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) return res.status(400).json({
        error: 'content missing'
    })

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
      .save()
      .then(savedPerson => {
        res.json(savedPerson)
      })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})