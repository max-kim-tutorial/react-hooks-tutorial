# 훅신훅왕(Hook God Hook King)

그동안 줍줍해왔던 React Hooks 레퍼런스 정리

## 0) 튜토리얼에서 해볼 것

- useEffect의 모든 기능 사용
- 렌더링 최적화(useMemo, useCallback)
- context API 쉽게 써보기(useContext)
- custom hook 만들어다 써보기(I/O 처리)

## 1) 훅

### [1-1) 당최 훅을 왜 hook이라 부르는 것인가?](https://stackoverflow.com/questions/467557/what-is-meant-by-the-term-hook-in-programming)

- **컴포넌트와 같은 일반적인 구현체에 기능을 연동(hook into) 해주는 함수 혹은 로직.** 굳이 번역하자면 **연동함수?** 쯤 될듯
- A hook is a place and usually an interface provided in packaged code that allows a programmer to **insert customized programming.** 개발자가 커스텀한 로직을 주입할 수 있게 하는 수단.
- A hook is **functionality provided** by software for users of that software to have their own **code called under certain circumstances.** That code can augment or replace the current code. 적당하게 호출.
- 약간 [종단 관심사](https://github.com/MaxKim-J/Code-Review-References/blob/master/01_designPrinciples/03_aspectOrientedProgramming.md) 같은걸 실현하기 위해 제공하는 인터페이스.
- [프록시](https://github.com/MaxKim-J/Code-Review-References/blob/master/02_desingPatterns/10_proxyPattern.md) 패턴의 느낌 + [IOC](https://github.com/MaxKim-J/Code-Review-References/blob/master/01_designPrinciples/04_InversionOfControl.md)의 향기.. => 개발자는 코드를 제공하고 프레임워크는 적절하게 적절한 때에 호출한다.
- [콜백이랑 비슷한 개념처럼 보일텐데 살짝 다르다.](https://stackoverflow.com/questions/11087543/what-is-the-difference-between-hook-and-callback) 약간 콜백이 훅의 한 종류. 대충 정리하자면.
  - 훅은 주로 라이브러리에 개발자의 코드의 호출 주도권을 넘긴다
  - 콜백은 **연동한다**는 넓은 의미를 가진 어휘인 훅의 한 종류라고 볼 수 있는데, 콜백의 호출 주도권은 커널이나 GUI Subsystem에게로 넘겨진다.  
- 여담인데 함수형 컴포넌트에서도 상태관리를 해줄 수 있는게 훅이다 이런 설명 이상함. 훅이 왜 hook이라 이름붙었는지 설명이 안됨

### [1-2) 리액트 팀이 훅을 개발한 이유](https://ko.reactjs.org/docs/hooks-intro.html#motivation)

#### 1-2-1) 컴포넌트 사이에서 상태와 관련된 로직을 재사용하기 어렵다

- 상태 관련해서 쓰기 좀 더 좋은 기초요소 제공
- 훅은 계층의 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와줌

#### 1-2-2) 복잡한 컴포넌트는 이해하기 어려움

- 생명주기 로직이 불편함. 한 함수에 연관없는, 그것도 부수효과를 일으키는 코드들이 단일 메서드로 결합하기 때문에 버그가 쉽게 발생하고 무결성을 해침 => `useEffect 패러다임`
- 상태 관련 로직이 결국 모든 공간에 있는 불편한 꼴이기 때문에 이런 컴포넌트들은 나누기도 불편하고, 테스트하기도 어려워짐.
- 상태 관리 라이브러리를 쓰면 되지만 종종 너무 많은 추상화 단계를 거치고, 다른 파일 사이에서 건너뛰기를 요구하며 컴넌 재사용을 더 어렵게 만듬
- 그러니깐 생명주기 기반으로 로직을 시계열로 쪼개는데 초점을 맞추기 보다는, 훅을 통해 로직에 기반을 둔 작은 함수로 컴넌을 나눌 수 있음

#### 1-2-3) 클래스는 혼란스럽다

- 코드의 재사용성과 코드 구성을 좀 더 어렵게 만들고, 리액트를 배우는데 큰 진입장벽이 된다.(this의 동작방식이라던지, 이벤트 핸들러의 this 상실이라던지)
- 클래스는 나눠지기가 쉽지 않고, 핫 리로딩을 깨지기 쉽고 신뢰할 수 없게 만든다. 
- 개념적으로 리액트 컴넌은 항상 함수에 더 가깝다. 사실 컴포넌트 기반 개발은 언제나 함수형 프로그래밍이랑 친하다.

#### 1-2-4) 점진적 적용

- 그렇다고 해서 클래스 기반 컴넌을 없애려는게 아니다. 갑자기 후루룩 다 배울 필요도 없다.
- 훅은 존재하는 코드와 함께 나란히 작동함으로써 점진적인 리팩토링의 여지를 남긴다. 

## 2. 훅의 규칙

### 2-1) [리액트 공식문서 훅 규칙](https://ko.reactjs.org/docs/hooks-faq.html)

#### 2-1-1) 최상위에서만 훅을 호출해라

- 반복문, 조건문 혹은 중첩된 함수 내에서 Hook을 호출하지 마라. 대신 항상 함수의 최상위에서 호출해야 한다.
- 이 규칙을 따르면 컴포넌트가 렌더링 될때마다 항상 동일한 순서로 훅이 호출되는게 보장되는데, 순서와 모든 훅의 호출을 보장하는게 중요하다.
- 훅을 들쭉날쭉 호출하는 것은,, 들여다보지 않으면 이해하기 힘든 어떤 내부의 규칙에 의해서 컴포넌트가 동작되는 것이므로, 컴포넌트를 이해하기 힘들게 만들고, 재사용을 힘들게 만들며 무결성을 해친다. 
- **리액트는 훅이 호출되는 순서에 의존한다.** 훅의 호출 순서가 렌더링 간에 동일하다면 리액트는 지역적인 state를 각 hook에 연동시킬 수 있다. 하지만 어떤 상황에서 훅이 호출되지 않는다면, 그 훅이 관여하는 로직에 의존하는 다른 훅이 고장날 수 있다,
- 조건부로 부수효과를 호출되기를 원한다면, 조건문을 hook내부에 넣는 식으로 접근하라

#### 2-1-2) 오직 React 함수 내에서 Hook을 호출해야 함

- 훅을 일반적인 자바스크립트 함수에서 호출하지 마셈. 모든 상태 관련 로직을 소스코드(컴포넌트)에서 명확하게 보이도록 하기 위한 규칙임.

### 2-2) 훅은 생명주기를 어떻게 대체하고 있나

- constructor : 함수형 컴포넌트니까 컨스트럭터가 필요없구 초기화도 필요없다,,, state가 필요하면 useState훅으로 사용할 수 있다. 
- shouldComponentUpdate: memo 훅을 써서 특정 state를 업뎃하지 않고 기억해서 재사용해서 렌더링할 수 있다.
- render : **함수형 컴포넌트가 리턴하는 값 그 자체**로 대체된다. 원래는 렌더 생명주기의 순수한 리턴값이 컴포넌트의 결과값이었는데.
- componentDidMount, componentDidUpdate, componentWillUnmount : useEffect가 이 모두를 대체한다. 다시말하면 컴포넌트가 렌더링 시작해서 mount되는 상황, state가 업데이트 되는 상황, 컴포넌트가 소멸되는 상황 모두를 useEffect가지고 제어한다는 것이다.
- getSnapshotBeforeUpdate, componentDidCatch, getDerivedStatesFromProps: 이 생명주기들에는 딱히 대응되는건 없다. 그치만 사실 이런 생명주기 없이도 잘 작동되는거 보면 훅을 사용하는 지금의 리액트가 **생명주기 패러다임과는 다른 관점을 견지한다는 것을 알 수 있을 것**

## 3. 훅들

### [3-1) useState]()

함수형 컴포넌트에 렌더링을 불러일으키는 상태값을 연동

- 상태 유지 값과 그 값을 갱신하는 함수를 반환한다.
- 최초로 렌더링을 하는 동안 반환된 state는 첫번째 전달된 인자의 값과 같다.
- setState 함수는 state를 갱신할때 사용. 새 state값을 받아 컴포넌트 리렌더링을 큐에 등록하게 된다. => 즉 setState를 만나면 컴포넌트가 재랜더링된다.
- 다음 리랜더링시에 useState를 통해 반환받은 첫번째 값은 항상 갱신된 최신 state
- 초기 state값이 고비용 계산의 결과라면, 초기 렌더링 시에만 실행될 함수를 제공할 수 있다.

```jsx
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

- state hook을 현재의 state와 동일한 값으로 갱신하는 경우 React는 자식을 렌더링한다거나 무엇을 실행하는 것을 회피하고 처리를 종료함 => 실행의 회피
- 근데 막 state를 초기화하는 식으로 렌더링을 하지 않는 것 보다는 컴포넌트 최적화를 도모하는게 더 맞는듯.

#### [3-1-1) 어떻게 이 간단한 함수가 컴포넌트의 state를 기록하고 변화를 추적하나?](https://hewonjeong.github.io/deep-dive-how-do-react-hooks-really-work-ko/)

**클로저쨩  두둥등장**

- 클로저를 언급하는 순간 + 그리고 3-1-1 제목을 다시 보는 순간 `아!` 한다면 당신은 공부를 좀 하셨군요
- 훅을 사용하면 bind된 컨텍스트 같은 this의 습격을 걱정할 필요가 없게 되지만, 클로저에 대해서 걱정해야 한다. 
- useState를 구성하는 원리의 가장 큰 부분이 바로 이 클로저. 함수에서 변수 은닉을 할 수 있도록 해준다. + [모듈패턴](https://github.com/MaxKim-J/Code-Review-References/blob/master/02_desingPatterns/01_modulePattern.md)

```jsx
// 완전 정확한건 아닌데 그냥 이런 흐름이다 이런 것

function useState(initialValue) {
  // 클로저 변수 => 이 함수의 실행 컨텍스트가 없어져도 => 즉 렉시컬 스코프 밖에서도
  // 리턴하는 함수가 이 값을 참조한다면 GC가 안됨
  var _val = initialValue 

  function state() {
    // 클로저 변수를 참조하는 게터함수
    return _val
  }

  function setState(newVal) {
    // 클로저 변수를 수정하는 세터함수
    _val = newVal 
  }

  return [state, setState] // 외부에서 사용하기 위해 함수들을 노출
}
var [foo, setFoo] = useState(0) // 배열 구조분해 사용
console.log(foo()) // 0 출력 - 위에서 넘긴 initialValue
setFoo(1) // useState의 스코프 내부에 있는 _val를 변경합니다.
console.log(foo()) // 1 출력 - 동일한 호출하지만 새로운 initialValue
```

- 리액트와 다른 프레임워크의 맥락에서 보면 이거슨 'state'라고 할 수 있는 것이다. 클래스형 컴포넌트때와 마찬가지로 은닉화되고 보호받고 있다.
- 실제 리액트 컴넌에서 사용하려면 state가 함수가 아니라 변수여야 한다. 근데 여기서 `_val`을 그대로 노출하면 위험한 것이므로 앞서 구현했던 useState에 클로저를 겹으로 달아주거나 + 매 렌더링마다 초기화를 시켜야 하므로 값을 쓰는게 아니라 [호출해주는 식으로 바꾼다면 호출 할때마다 값을 가져온다.](https://rinae.dev/posts/getting-closure-on-react-hooks-summary) 

```js
// 1
useState(initialValue) {
  _val = _val || initialValue
  function setState(newVal) {
    _val = newVal
  }
  return [_val, setState]
}

// 2
function useState(initVal) {
  let _val = initVal
  const state = () => _val
  const setState = newVal => {
    _val = newVal
  }
  return [state, setState]
}
```

- 아니 그렇다면,,, 메모리에 할당된 클로저 변수는 단 하나인데 useState를 여러번 호출하면,,, state를 관리할 수 있나여??
- 여러개의 훅이 호출될때 컴포넌트가 어떻게 동작하고 있는지 알아보자. 앞에서 구현한 useState를 두 번 이상 호출한다면, useState라는 하나의 함수에 할당된 클로저 변수는 동일하기 때문에 state는 덮어씌워진다.

```js
function Component() {
  const [count, setCount] = React.useState(1)
  const [text, setText] = React.useState('apple')
  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: word => setText(word),
  }
}
var App = React.render(Component) // {count: 1, text: 'apple'}
App.click()
var App = React.render(Component) // {count: 2, text: 2}
App.type('banana')
var App = React.render(Component) // {count: 'banana', text: 'banana'}
```

- useState의 반환값을 다른 값으로써 관리하고 싶다면 각 값 별로 배열에 담아 다루면 된다. 훅을 담아 둔 배열과 현재 어떤 훅이 어떤 인덱스를 바라보고 있는지 관리해주는 요령이 필요하다. 그리고 그걸 리액트가 한다!

```js
const React = (function() {
  let hooks = []
  let idx = 0
  function useState(initVal) {
    const state = hooks[idx] || initVal
    const _idx = idx // 이 훅이 사용해야 하는 인덱스를 가둬둔다.
    const setState = newVal => {
      hooks[_idx] = newVal
    }
    idx++ // 다음 훅은 다른 인덱스를 사용하도록 한다.
    return [state, setState]
  }
  function render(Component) {
    idx = 0 // 랜더링 시 훅의 인덱스를 초기화한다.
    const C = Component()
    C.render()
    return C
  }
  return { useState, render }
})()
```

- 여기서 훅의 규칙을 이해할 수 있다. 조건부로 훅이 호출되거나 루프 안에서 훅이 호출되어야 하는 경우 등이 있다면 이 인덱스의 순서를 보장할 수 없다! 불순해지는 것이다. 
- 여러개의 훅은 이렇게 배열과 같은 큐에 넣어져서 인덱스로 관리되고 리액트 렌더링 결과물은 이 훅 배열에 의존한다.

#### [3-1-2) 비동기로 동작한다는데??](https://darrengwon.tistory.com/651)

- setState를 호출한 직후에 바로 업데이트된 state를 확인할 수 없다. 곧바로 변경 내역이 반영되지 않는다. 
- **state가 바뀌면 재랜더링되고 => 재랜더링되면 바뀐 state가 반영된다**
- 변화를 보고 싶다면 useEffect를 사용하는게 맞다. [useEffect는 업데이트 직후의 최신 state값에 접근할 수 있도록 해준다.](https://stackoverflow.com/questions/54119678/is-usestate-synchronous)
- setState는 프로미스를 반환하는 함수는 아니기때문에 async await같은걸로 제어가 되는건 아니다. 정확히는 비동기로 작동하는건 아닌데, 비동기로 작동하는 것처럼 보인다.
- 더 덧붙이자면 앞에서 계속 보았듯 클로저를 기반으로 함수가 상태 값을 사용하는데, 상태 업데이트는 기존 클로저가 아니라 새로운 클로저가 생성되는 다음 다시 렌더링에 반영된다. **즉 재랜더링이 되지 않는다면 클로저는 그대로고 결국 state도 그대로다**


### 3-2) useEffect

부수효과와 관련된 로직을 **죄다** 해결하는 부수효과 마스터

#### 3-2-1) 생명주기와는 완전 다른 useEffect 패러다임

#### 3-2-2) 의존성 배열과 관련한 썰

#### 3-2-3) 리액트 팀이 원했던 생명주기의 대체

### 3-3) useRef

DOM에 접근해보셈

#### 3-3-1) DOM 접근 말고 다른 용도. 그리고 왜 그렇게 쓸 수 있는지