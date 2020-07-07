const mongoose = require('mongoose') // Importing mongoose library


if (process.argv.length < 3) { // Checking that the password is provided as an argument
    console.log('give password as argument')
    process.exit(1)
}

if (process.argv.length > 3 && process.argv.length < 5) {
    console.log("Missing name or number")
    process.exit(2)
}
const entrySchema = new mongoose.Schema({ //Creating the schema of the entry
    name: String,
    number: String,
    id: Number
})

const Entry = mongoose.model('Entry', entrySchema)
const password = process.argv[2] // extracting the password
const url =
    `mongodb+srv://fullstack:${password}@fullstackopen-izf0g.mongodb.net/notebook?retryWrites=true&w=majority`// connection string

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }) // Connecting to the database

if (process.argv.length === 3) {

    Entry.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
            mongoose.connection.close()

        })
    })
}
else {

    const name = new String(process.argv[3]) // extracting the Name
    const number = new String(process.argv[4]) // extracting the Number



    const generateId = max => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const entry = new Entry({
        name: name,
        number: number,
        id: generateId(10000)

    })

    entry.save().then(response => {
        //console.log("response",response)
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })

}
