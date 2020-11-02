import React, {useState, useEffect} from 'react';

function UseEffectIrony() {

  const [val1, setVal1] = useState(0)
  const [val2, setVal2] = useState(0)

  // 1) 의존성 배열은 기본적으로 이펙트 안의 의존성을 표시하는 역할을 한다
  // 2) 재 랜더링 상황에서 의존성 배열 안의 state가 바뀔때 이펙트가 실행되기도 한다
  // useEffect 콜백 안에서 쓰이는 의존성이 배열에 없으면 eslint는 경고를 뱉는다.
  // 다만 반대로, 콜백 안에서 쓰이지 않는 의존성 배열이 배열에 있는건 문제가 안 된다.
  // 우리가 의존성 배열에게 바라는 이 두 가지 역할은 약간의 충돌을 수반할 수 있다.
  // 괴랄한 부수효과는 쓰지 말라는 뜻일지도
  useEffect(() => {
    console.log('val1이 바뀌면 val2를 바꿔보세요')
    setVal2(v => v + 10)
  }, [val1])

  const handleClick = () => {
    setVal1(val1 + 1)
  }

  return (
    <div className="App">
      <div>{val1}</div>
      <div>{val2}</div>
      <div onClick={handleClick}>increase idx</div>
    </div>
  );
}

export default UseEffectIrony;