import React, { useState, useMemo, ChangeEvent } from 'react';

function InputRenderingOpt() {
  const [inputs, setInputs] = useState({username: ''});

  const inputOnChange = (e:ChangeEvent<HTMLInputElement>):void => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const getUserNameWordLength = (userName:string):number => {
    return userName.split(' ').length
  }

  // 근데 이렇게 변수로 쓰는게 맞나
  const userNameWordLength = useMemo(
    () => getUserNameWordLength(inputs.username),
    [inputs.username]
  )

  return (
    <div className="App">
      <label htmlFor="username">유저네임: </label>
      <input id="username" name="username" type="text" onChange={inputOnChange} />
      <button type="submit">submit</button>
      <div>{userNameWordLength}</div>
    </div>
  );
}

export default InputRenderingOpt;