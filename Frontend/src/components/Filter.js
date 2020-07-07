import React from 'react'

const Filter = ({filterValue, changeHandler}) => (
    <>
    <h3>Filter</h3>
    <input value={filterValue} onChange={changeHandler} ></input>
    </>
)

export default Filter;