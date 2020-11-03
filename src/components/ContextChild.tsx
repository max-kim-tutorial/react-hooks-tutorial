import React from 'react'
import { useTutorialContext } from '../contextFromOutside'

export default function ContextChild() {
  const { state, dispatch } = useTutorialContext()
  const { value } = state

  const plusOne = () => {
    dispatch({type:'add', payload:1})
  }

  const minusOne = () => {
    dispatch({type:'mul', payload:1})
  }

  return (
    <div>
      <div>{ value }</div>
      <div onClick={plusOne}>plus one</div>
      <div onClick={minusOne}>minus one</div>
    </div>
  )
}
