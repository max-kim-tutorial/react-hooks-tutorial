import React, {useReducer} from 'react'
import {reducer, TutorialContext, initialState, TutorialContextType} from '../contextFromOutside'
import ContextChild from "./ContextChild"

export default function ContextParent() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <TutorialContext.Provider value={{state, dispatch} as TutorialContextType}>
      <ContextChild/>
    </TutorialContext.Provider>
  )
}
