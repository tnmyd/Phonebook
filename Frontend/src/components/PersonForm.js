import React from 'react'
import '../styles/Person.css'

const PersonForm = ({newName, newNumber, nameChangeEventHandler, numberChangeEventHandler, addNameFunction}) => (
    <form>
        <div>
            name: <input value ={newName} onChange = {nameChangeEventHandler}/>
        </div>
        <div>
            number: <input value ={newNumber} onChange = {numberChangeEventHandler}/>
        </div>

        <div>
          <button type="submit" onClick = {addNameFunction} className="add-button">add</button>
        </div>
    </form>
)

export default PersonForm