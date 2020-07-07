import React, { useState, useEffect } from 'react'
import '../styles/App.css'
import Filter from './Filter'
import PersonForm from './PersonForm'
import personService from './../services/persons'
import Person from './Person'
import Notification from './Notification'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ message, setMessage ] = useState(null)
  
  useEffect(() => {
    personService.getAll("http://localhost:3001/persons").then(notes => setPersons(notes)).catch(error => console.log(error))
  },[])
  

  const addName = (event) => {
      // This function is required to change the persons array
    event.preventDefault()
    
    const namePresent = persons.map(person => person.name === newName).includes(true) // Go through the array and check if name is present even once

    if(namePresent)
    {
       const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
       if(result)
       {
        const existingObject = persons.find(person => person.name === newName)
        const newObject = {
          ...existingObject, number : Number(newNumber)
        }
        personService.update(newObject.id, newObject).then(returnedPerson => {
          setPersons(persons.map(person => person.name !== newName ? person : returnedPerson
            )
          )
             setMessage("Updated Number")
             setTimeout(() => {
              setMessage(null)
            }, 5000)
             setNewNumber('')
             setNewName('')             
        }).catch(error => {
          setMessage(error.response.data.error)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
        })
       }
    } 
       
    else{
        const newObject = {
            name : newName,
            number : newNumber
        }
        personService.add(newObject).then(newNote => {
          setPersons(persons.concat(newNote))
          setMessage("Added new Number")
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setNewNumber('')
          setNewName('')
        }).catch(error => {
          setMessage(JSON.stringify(error.response.data))
            setTimeout(() => {
              setMessage(null)
            }, 5000)
        })
         //Use concat to replace rather than mutate.
    }
  }

  const deleteName = (event, id) => {
    const nameToDelete = persons.filter(person => person.id === id)[0].name
    const result = window.confirm(`Delete ${nameToDelete}?`)
    if(result)
      personService.del(id).then(response => {
      const modifiedPersons = persons.filter(persons => persons.id !== id)  
      setPersons(modifiedPersons)
      setMessage(`Information about ${nameToDelete} has been successfully deleted from the server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      }).catch(error => {
        setMessage(`Information about ${nameToDelete} has already been deleted from the server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
  }

  const handleNameChange = (event) => { 
      //This function is required to change the value of newName since it is a state of the App component and this input is controlled by it
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => { 
    //This function is required to change the value of newName since it is a state of the App component and this input is controlled by it
  setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => { 
  setNewFilter(event.target.value)
  }

  return (
    <div className="body">

      <h2>Phonebook</h2>
      <Notification message={message}></Notification>
      <main>
      
      <Filter 
          filterValue = {newFilter} 
          changeHandler = {handleFilterChange} 
      />
      <h3>Add a new Entry</h3>
      <PersonForm 
          newName = {newName} 
          newNumber = {newNumber} 
          nameChangeEventHandler = {handleNameChange} 
          numberChangeEventHandler = {handleNumberChange} 
          addNameFunction = {addName} 
      />
      <h3>Numbers</h3>
      {
       (newFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))).map(person => <Person key = {person.name} person = {person} handleDeletion = {(event) => deleteName(event,person.id)}/>)

       // newFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())).map(person => <Person key = {person.name} person = {person}/>)
      }
      {/* <Persons listOfPersons = {newFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))} /> */}
      </main>
    </div>
  )
}

export default App