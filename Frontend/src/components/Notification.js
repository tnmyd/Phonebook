import React from 'react'
import '../styles/Notification.css'

const Notification = ({ message }) => {
  let a=message;
  
    if (message === null) {
      return null
    }
    else if(message.error !== null && message.error!== undefined)
    {
      console.log(message["error"])
        return (
        <div className="error">
        {message}
        </div>
        )
    }
    console.log(a)
    console.log(a.error)
    return (
      <div className="message">
        {message}
      </div>
    )
  }

export default Notification