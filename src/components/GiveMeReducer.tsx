import React, {useReducer} from 'react';
import reducerFromOutside from "../reducerFromOutside"

function GiveMeReducer() {

  const [state, dispatch] = useReducer(reducerFromOutside, {value:0})

  return (
    <div className="App">
      <div>{state.value}</div>
      <div onClick={() => {dispatch({type:'sum', payload:1})}}>plus 1</div>
      <div onClick={() => {dispatch({type:'min', payload:1})}}>minus 1</div>
    </div>
  );
}

export default GiveMeReducer;