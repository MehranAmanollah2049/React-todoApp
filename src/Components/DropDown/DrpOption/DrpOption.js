import React, { useContext, useEffect, useState } from 'react'
import './DrpOption.css'
import AppContext from '../../../Contexts/AppContext';
import TodoContext from '../../../Contexts/TodoContext';

export default function DrpOption(props) {

  let AppContextData = useContext(AppContext)
  let TodoContextData = useContext(TodoContext)

  function handleClick() {
    if(props.type == 'filterDrp') {
      AppContextData.setFilter(props.title)
    }
    else if(props.type == 'edit') {
      TodoContextData.setEditMode()
    }
    else if(props.type == 'done') {
      TodoContextData.setDone()
    }
    else if(props.type == 'delete') {
      TodoContextData.deleteTodo()
    }
  }

  return (
    <div className={`drpOption${props.theme ? ' ' + props.theme : ''}`} onClick={handleClick}>
      <div className="loading-spinner"></div>
      <span>{props.title}</span>
    </div>
  )
}
