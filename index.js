require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')


morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.use(express.json())


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

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person
      .findById(id)
      .then(person => {
        if (person) {
          res.json(person)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => {
        next(err)
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

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log( `Error: ${error.message}`)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  response.status(error.status).send(error.message)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})