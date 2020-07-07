const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Entry = require('./models/entry')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
let entries = [
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': 4
  }
]

// const generateId = max => {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// const checkDuplicate = name => {
//   return entries.filter(entry => entry.name === name).length > 0
// }

app.get('/info', (request, response, next) => {
  Entry.estimatedDocumentCount().then(numberOfPeople => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${numberOfPeople} people</p>
                  <p>${date}<p>
    `)

  }).catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries.map(entry => entry.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Entry.findOne({ _id : id }).then(entry => {
    console.log(entry)
    if(entry)
      response.json(entry.toJSON())
    else
      response.status(404).end()

  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const data = request.body
  if(!data.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if(!data.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }
  // if(checkDuplicate(data.name)){
  //   return response.status(400).json({
  //     error: 'name must be Duplicate'
  //   })
  // }

  const entry = new Entry({
    name : data.name,
    number : data.number
  })
  entry.save().then(newEntry => {
    response.json(newEntry.toJSON())
  }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const data = request.body
  const id = request.params.id
  console.log(data)
  Entry.findOneAndUpdate({ _id : id }, { $set: { number: data.number } }, { new : true, runValidators: true })
    .then(updatedEntry => {
      console.log('updated entry',updatedEntry)
      response.json(updatedEntry.toJSON())
    }).catch(error => next(error))

})





app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Entry.findOneAndDelete({ _id : id }).then(deletedEntry => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})