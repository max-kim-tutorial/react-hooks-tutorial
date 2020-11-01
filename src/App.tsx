import React, {useState, useEffect} from 'react';

function App() {

  const [count, setCount] = useState(0)
  const [idx, setIndex] = useState(0)

  useEffect(() => {
    console.log('음 복잡쓰')
    setCount(c => c+10)
  }, [idx])

  const handleClick = () => {
    console.log(idx)
    setIndex(idx + 1)
  }

  return (
    <div className="App">
      <div>{count}</div>
      <div>{idx}</div>
      <div onClick={handleClick}>increase idx</div>
    </div>
  );
}

export default App;
