import React, { Fragment, useEffect, useState } from 'react'
import './DropDown.css'

export default function DropDown(props) {


  let [drpState,setDrpState] = useState(false)

  useEffect(() => {
    setDrpState(props.isActive)
  },[props])

  function removeDrp() {
    setDrpState(false)
  }

  return (
    <Fragment>
      <div className={`drpAll ${props.side}${drpState ? ' active' : ''}`}>
        {props.children}
      </div>
      <div className={`overlay${drpState ? ' active' : ''}`} onClick={removeDrp}></div>
    </Fragment>
  )
}

