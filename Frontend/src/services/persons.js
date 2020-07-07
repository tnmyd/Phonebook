import Axios from 'axios'
// This is the person service class
const baseUrl = "/api/persons"
//"http://localhost:3001/persons"

const getAll = () => {
   return Axios.get(baseUrl)
   .then(response => response.data)
}

const add = newObject => {
    return Axios.post(baseUrl, newObject)
    .then(response => response.data)
}

const update = (objectId,modifiedObject) => {
    const nameUrl =  `${baseUrl}/${objectId}`
    return Axios.put(nameUrl, modifiedObject)
    .then(response => response.data)
}

const del = objectId => {
    const nameUrl =  `${baseUrl}/${objectId}`
    return Axios.delete(nameUrl).then(response => {
        console.log("Person Service",response.data)
    })
}
export default{
    getAll,
    add,
    update,
    del
}