import React from 'react'
import '../styles/Person.css'

const Person = ({person, handleDeletion}) => {
    return(
    <>
    <p>{person.name} {person.number}      
     <button onClick={handleDeletion} className="delete-button">delete</button></p>
    </>
)}

export default Person