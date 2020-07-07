const mongoose = require('mongoose') // Importing mongoose library
var uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false  })
    .then(result => { 
        console.log('connected to MongoDB') 
    })
    .catch((error) => { 
        console.log('error connecting to MongoDB:', error.message)
    }) // Connecting to the database

const entrySchema = new mongoose.Schema({ //Creating the schema of the entry
    name: {type : String, minlength : 3, required : true, unique: true},
    number: {type : Number, min : 1000000000, required : true}
})

entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
entrySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Entry', entrySchema)