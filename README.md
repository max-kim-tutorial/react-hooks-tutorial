# 훅신훅왕(Hook God Hook King)

그동안 줍줍해왔던 React Hooks 레퍼런스 정리

## 0) 튜토리얼에서 해본 것

|번호|주제|컴포넌트 진입점|
|-|-|-|
|1|useEffect의 의존성 배열 이상한 점|UseEffectIrony.tsx|
|2|리듀서 함수를 컴포넌트 외부에서 모듈로 가져다 쓰는 useReducer 사용|GiveMeRedux.tsx|
|3|useReducer + useContext + context와 reducer 모듈|ContextParent.tsx|
|3|렌더링 최적화(useMemo, useCallback)|-|
|4|context API 쉽게 써보기(useContext)|-|
|5|custom hook 만들어다 써보기(I/O 처리)|-|

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

> 여담인데 **함수형 컴포넌트에서도 상태관리를 해줄 수 있는게 훅이다** 이런 설명은 맞는 말이긴 한데 많은게 생략된 설명이라고 생각합니다. 훅이 왜 애당초 hook이라 이름붙었는지부터 설명하는게 맞는거 가타요

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

## 2. 훅 규칙

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
- render : 원래는 렌더 생명주기의 순수한 리턴값이 컴포넌트의 결과값이었는데, **함수형 컴포넌트가 리턴하는 값 그 자체**로 대체된다. 
- componentDidMount, componentDidUpdate, componentWillUnmount : useEffect가 이 모두를 대체한다. 다시말하면 컴포넌트가 렌더링 시작해서 mount되는 상황, state가 업데이트 되는 상황, 컴포넌트가 소멸되는 상황 모두를 useEffect가지고 제어한다는 것이다. => 정확히 말하면 이제 컴포넌트가 어쩌구 그런 상황은 없다 useEffect 부분 참조..
- getSnapshotBeforeUpdate, componentDidCatch, getDerivedStatesFromProps: 이 생명주기들에는 딱히 대응되는건 없다. 그치만 사실 이런 생명주기 없이도 잘 작동되는거 보면 훅을 사용하는 지금의 리액트가 **생명주기 패러다임과는 다른 관점을 견지한다는 것을 알 수 있을 것.** 역시 useEffect 부분 참조

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

- 아니 그렇다면,,, 메모리에 할당된 클로저 변수는 단 하나인데 useState를 여러번 호출하면,,, state를 관리할 수 있나여?? 이거 [싱글톤](https://github.com/MaxKim-J/Code-Review-References/blob/master/02_desingPatterns/03_singletonPattern.md) 아니에여??
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
- [훅배열로 여러 훅을 관리하게 되고, 컴포넌트가 렌더링될때 훅 배열 안에서 해당 훅을 참조할 수 있는 인덱스가 초기화된다](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

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
- 여러개의 훅은 이렇게 배열과 같은 큐에 넣어져서 인덱스로 관리되고 리액트 렌더링 결과물은 이 훅 배열에 의존한다. useEffect의 의존성 배열처럼 리액트 전체는 훅배열에 의존하여 뷰를 렌더링하게 된다고 볼 수 있지 않을까?

#### [3-1-2) 비동기로 동작한다는데??](https://darrengwon.tistory.com/651)

- setState를 호출한 직후에 바로 업데이트된 state를 확인할 수 없다. 곧바로 변경 내역이 반영되지 않는다. 
- **state가 바뀌면 재랜더링되고 => 재랜더링되면 바뀐 state가 반영된다**
- 변화를 보고 싶다면 useEffect를 사용하는게 맞다. [useEffect는 업데이트 직후의 최신 state값에 접근할 수 있도록 해준다.](https://stackoverflow.com/questions/54119678/is-usestate-synchronous) => 근데 사실 이것도 state가 바뀌었을 때, 즉 렌더링이 다시 되었을때 접근하는 것이라서 딱히 특별한 동작을 수반하는 것은 아니다.
- setState는 프로미스를 반환하는 함수는 아니기 때문에 async await같은걸로 제어가 되는건 아니다. 정확히는 비동기로 작동하는건 아닌데, 비동기로 작동하는 것처럼 보이는 것이다.
- 더 덧붙이자면 앞에서 계속 보았듯 클로저를 기반으로 함수가 상태 값을 사용하는데, 상태 업데이트는 기존 클로저가 아니라 새로운 클로저가 생성되는 다음 다시 렌더링에 반영된다. **즉 재랜더링이 되지 않는다면 클로저는 그대로고 결국 state도 그대로다**

### 3-2) useEffect

부수효과와 관련된 로직을 **죄다** 해결하는 부수효과 마스터

- [부수효과는 리소스의 정리가 필요한 것과 그렇지 않은 것들로 나눌 수 있다.](https://ko.reactjs.org/docs/hooks-effect.html) => return값에서 함수를 반환하는 것으로 처리 가능(클린업). 마운트가 해제되는 때에 정리를 실행
- 정리가 필요하지 않은 부수효과는 실행 이후 신경을 쓸게 없다.
- useEffect는 리액트에게 컴포넌트가 **렌더링 이후**에 어떤 일을 수행해야 하는지를 말한다. 리액트는 콜백으로 넘긴 함수를 기억했다가 DOM 업데이트를 수행한 이후에 불러낸다. 
- useEffect는 컴포넌트 내부에서 호출됨으로써 effect를 통해 state에 접근할 수 있게 된다. 함수 범위 안에 존재하기 때문에 특별한 API없이도 값을 얻을 수 있다. 
- useEffect는 렌더링 이후에 그냥 매번 수행된다(일관성있음) 생명주기처럼 update니 mount니 특정 상황에서 제각각 수행되지 않음. 리액트는 effect가 수행되는 시점에 이미 DOM이 업데이트되었음을 보장함
- **useEffect에 전달된 함수가 모든 렌더링에서 다르다.** state의 업데이트 여부와는 다르게 effect 내부에서 그 값을 읽을 수 있게 하기 위해서,,, 리렌더링하는 때마다 모두 이전과 다른 effect로 교체하여 전달. 이 점이 렌더링의 결과의 한 부분이 되게 만드는 지점인데, 각각의 effect는 특정한 렌더링에 속하게 된다.

#### [3-2-1) useEffect의 작동 원리](https://rinae.dev/posts/getting-closure-on-react-hooks-summary)

```jsx
// 인자로 콜백이랑 의존성 배열 받음
function useEffect(cb, depArray) {
  const oldDeps = hooks[idx] // 이미 저장되어있던 의존 값 배열이 있는지 본다.
  let hasChanged = true
  if (oldDeps) {
    // 의존 값 배열의 값 중에서 차이가 발생했는지 확인한다.
    // 실제로 리액트 구현체도 `Object.is` 로 값을 비교한다. 정확한 동작은 MDN 참고.
    hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]))
  }
  // 값이 바뀌었으니 콜백을 실행한다.
  if (hasChanged) {
    cb()
  }
  // useEffect도 훅의 일부분이다. hooks 배열에 넣어서 관리해준다.
  hooks[idx] = depArray
  idx++
}

function Component() {
  const [count, setCount] = React.useState(1)
  const [text, setText] = React.useState('apple')
  // 랜더링 시 최초에 한 번만 실행된다.
  // 배열 안에 관찰하고자 하는 상태를 전달하면 그 상태에 반응하여 콜백이 실행된다.
  React.useEffect(() => {
    console.log('side effect')
  }, [])
  // ...
}
```

#### 3-2-2) [생명주기와는 완전 다른 useEffect 패러다임](https://rinae.dev/posts/a-complete-guide-to-useeffect-ko#%ED%95%A8%EC%88%98%EB%A5%BC-%EC%9D%B4%ED%8E%99%ED%8A%B8-%EC%95%88%EC%9C%BC%EB%A1%9C-%EC%98%AE%EA%B8%B0%EA%B8%B0)

![이런 그림도 있었네](https://miro.medium.com/max/1400/1*Lvb5C_NdJCyt7YgA89nvNg.jpeg)

**생명주기 사고방식으로 useEffect를 이해하려고 하지 마라**  

> 제목에 링크단 글은 진짜 리액트 프로그래밍을 하는 사람이라면 진짜 n번쯤 읽고 [글쓴이 - Dan Abramov](https://overreacted.io/a-complete-guide-to-useeffect/)에게 [그랜절](https://namu.wiki/w/%EA%B7%B8%EB%9E%9C%EC%A0%88) 올려야할 글입니다,,,  

- 함수형 컴넌에서 모든 렌더링은 고유의 상태값과 이팩트를 가진다. => 만약에 setTimeout같은걸로 변한 state를 몇 초 뒤에 alert한다고 할 때, 함수형 컴포넌트는 setTimeout이 호출될 때의 state를 기반으로 alert를 보낸다(값을 잡아둔다). 이것으로 각 state는 랜더링시마다 다른 상태값을 **상수처럼** 가지고 있다는 것을 알 수 있다. 특정 렌더링 시 그 내부에서 props와 state는 영원히 같은 상태로 유지된다..! => 컴포넌트 안에서 state나 props 값을 읽어들이는 시점이 별로 중요하지 않다.
- 클래스형 컴포넌트는 동작이 좀 다른데 => this.state의 값은 특정 렌더링 시점의 값이 아니라 언제나 최신의 값을 가리킨다..! 그래서 매번 최신의 state가 여러번 alert되는 것을 볼 수 있다 => 리액트는 this.state가 최신 상태를 가리키도록 변경한댄다

```jsx
// 최초 랜더링 시
function Counter() {
  // ...
  useEffect(
    // 첫 번째 랜더링의 이펙트 함수
    () => {
      document.title = `You clicked ${0} times`;
    }
  );
  // ...
}
// 클릭하면 함수가 다시 호출된다
function Counter() {
  // ...
  useEffect(
    // 두 번째 랜더링의 이펙트 함수
    () => {
      document.title = `You clicked ${1} times`;
    }
  );
  // ...
}
// 또 한번 클릭하면, 다시 함수가 호출된다
function Counter() {
  // ...
  useEffect(
    // 세 번째 랜더링의 이펙트 함수
    () => {
      document.title = `You clicked ${2} times`;
    }
  );
  // ..
}
```

- 이펙트는 매 랜더링 후 실행되며, 앞에서 말했듯 매 렌더링마다 별도로 존재한다 =>  개념적으로 컴포넌트 결과물의 일부로서 특정 랜더링 시점의 prop과 state를 '본다' => 매 랜더링마다 특정 렌더링 시점의 상태값을 반영한다 => 이게 useEffect가 최신의 상태를 읽어 들이는 원리다. 다른 막 작용이 있는게 아니라 그냥 볼뿐...
- 그리고 이 개념은 나중에 useCallback등에서 설명하게 되겠지만 **useEffect 콜백도 최적화의 타겟이 되는 이유가 된다**
- 개념적으로 이펙트는 랜더링 결과의 일부다. 렌더링 결과에 영향을 미치는 인자다. => 엄격하게 이야기하면 그렇지는 않다고
- DOM 업데이트 이후에 useEffect가 실행되니 컴포넌트는 마운트와 업데이트의 구분이 없다. useEffect는 트리 바깥에 있는 것들을 props와 state에 따라 동기화할 수 있게 한다.
- 만약 컴포넌트가 최초 렌더링할때와 그 후에 다르게 동작하는 이팩트를 작성하고 싶다면, 흐름을 거스르는 것이다!(모든 것은 목적에 달렸지 여정은 중요하지 않다)

#### [3-2-3) 의존성 배열과 관련한 썰](https://rinae.dev/posts/a-complete-guide-to-useeffect-ko#%EC%9D%98%EC%A1%B4%EC%84%B1%EC%9D%84-%EC%86%94%EC%A7%81%ED%95%98%EA%B2%8C-%EC%A0%81%EB%8A%94-%EB%91%90-%EA%B0%80%EC%A7%80-%EB%B0%A9%EB%B2%95)

리액트에게 거짓말을 하지 마라 ㅎㅅㅎ 혼나용!!!

- 이펙트를 적용할 필요가 없다면 다시 실행하지 않는 것이 좋을 것이다. => 특정한 이펙트가 불필요하게 다시 실행되는 것을 방지하고 싶다면 의존성 배열을 useEffect의 인자로 전달할 수 있는 거시다
- 의존성 배열은 리액트에게 어떤 랜더링 스코프에서 나온 값 중 이펙트에 쓰이는 것 **전부**를 알려주는 힌트라고 인식해야한다.(이펙트가 지금 어떤 값에 의존하고 있는지를 표현) 기본적으로 이펙트는 컴포넌트의 state나 props를 알 수가 없기 때문이다.
- 의존성 배열의 요소들이 같다면 동기화할 것은 없으니 리액트는 이펙트를 스킵한다.
- 의존성에 대해 리액트에게 거짓말을 한다면 좋지 않은 결과를 가져오게 된다. 그런 상황이 대표적으로는 빈 배열을 의존성 배열로 넘기는건데(초기에만 이팩트를 실행하고 싶어서) => 진짜 의존성이 없는 경우 아니면 안 하는게 좋은거같다
- 이펙트를 한 번만 실행하고 싶어서 의존성 배열로 빈 배열을 넘겼는데 useEffect 내부의 setState 함수가 있다면 그것도 최초에만 실행될 것 => 버그가 터지기 쉬운 로직이 된다.
- 명확한 로직을 위해서라도 이펙트에 의존성을 솔직하게 전부 명시하는 것이 중요하다. [eslint가 도와줄 것이다.](https://github.com/facebook/react/issues/14920)
- 솔직한 의존성 배열을 작성하기 위해서는 **1) 컴포넌트에 있으면서 이펙트에 사용되는 모든 값이 의존성 배열 안에 포함되도록 고치고**, **2) 이펙트의 코드를 바꿔서 우리가 원하던 것보다 자주 바뀌는 값을 요구하지 않게 만든다(번역투가 이상한데 === 의존하지 않게끔 코드를 바꿀 수 있다면 바꿔준다)**

```jsx
// count를 사용
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);

// count를 사용하지 않음
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  return () => clearInterval(id);
  // effect에게 거짓말하지 않았다!
}, []);
```

- 만약에 useEffect안에서 setInterval처럼 클린업이 필요한 부수효과를 사용하고, state에 의존성이 있는 경우 이펙트는 매 렌더링때마다 count를 참조해 기존 interval을 해제하고 새로운 interval을 등록할 것인데, 이런 동작은 크게 필요 없다.
- 따라서 setState함수에 함수를 인자로 전달하여, 기존 count를 참조하여 값을 업데이트하게 만든다면, 의존성 배열의 count를 제거할 수 있다.
- 수정된 이펙트가 최초 단 한번만 실행되었다 하더라도, 첫번째 렌더링에 포함되는 인터벌 콜백은 인터벌이 실행될때마다 setCount를 호출해 state를 업데이트 할 것이므로 정확하게 동작한다. 리액트가 state를 이미 알고 있기 때문에 컴포넌트 내부에서 현재의 count를 알 필요가 없는 것이다.

#### 튜토리얼1) 클린업이 없는 경우(알쏭달쏭)

앞에서 이야기했던 예제에서 setInterval을 빼보도록 하게따(클린업이 없는 경우)

```jsx
useEffect(() => {
  setCount(10 + count)
}, [idx])
```

예컨데 이 코드는 Vue의 watch처럼 동작한다. idx라는 state가 바뀔때마다 count가 바뀐다. 근데 이거는 의존성 배열에 뻥을 치고있는 것이기 때문에, eslint에서는 의존성 배열에 count를 넣으라는 경고가 뜬다. 근데 막상 count를 넣으면 count의 값이 무한 널뛰기를 할 것이다. count의 값이 다르면 count의 값을 바꾸니까 계속 effect를 실행할 것이다. 

```jsx
useEffect(() => {
  setCount(c => c+10)
}, [idx])
```

이럴때 state 콜백을 이용하면 count값을 직접 참조하지 않기 때문에 무한 널뛰기 현상이 없어지고 예상했던 것처럼 동작한다.

처음에 훅을 배우고 써볼때 나는 **"의존성 배열의 요소에 해당하는 값이 바뀔 때마다 이펙트 실행한다"** 이런 느낌으로 이해하고 있었다. 뭐 동작을 생각해보면 백프로 틀린말은 아닌데, 사실 생명주기 사고방식에서 자유롭지 못한 것이다.  

그런데 그게 다가 아니다. 정확히 해야될게 의존성 배열은 단순히 **어떤 state나 props의 변화를 관찰하라**가 아니라 **콜백으로 전달하는 이 부수효과는 배열 안의 요소에 의존을 한다**는 것을 **알려주는** 역할을 한다. 이 두 가지는 큰 차이를 야기하는데, useEffect는 당연히 콜백이 배열 안의 요소들에 **어떤 방식으로 의존을 하는지**까지는 모른다. 그래서 idx가 바뀌었으니 그저 콜백을 실행한다. 

의존성 배열에게 의존성을 알려주는 의무를 부여함과 동시에 콜백을 trigger하는 값의 목록을 제공하라는 요구사항은 상충될 여지가 있는데 왜 이렇게 만든걸까 싶기도 하다. 의존성 배열에 있는 것을 두리뭉실하게 동기화의 타겟으로 보는 것인지? 괴랄한 버그를 유발할 수 있는 이상한 상태값 참조를 콜백에서 개발자가 알아서 지우라는 뜻인지? 근데 또 웃긴게 콜백에서 쓰지 않는 변수를 의존성 배열에 넣으면 오류가 안 난다. 이럴때는 또 watch처럼 쓸 수 있는 것인데

깔끔한 이펙트를 만들기 위해서는 개발자가 의존성 배열을 지키면서, 위와 같은 괴랄한 문제가 없는 상태 업데이트를 할 수 있게끔 로직을 작성해줘야 한다. 개발자의 권한이 큰 것이다. 어쨌든 한가지 솔리드한 사실은 **useEffect 안에서 쓰이면 무조건 의존성 배열에 들어가야 한다.**

#### [3-2-4 왜 useEffect는 이렇게 렌더링 이후 매번 실행되게끔 만들어진거임?](https://ko.reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)

- 요런 디자인은 버그가 적은 컴포넌트를 만드는데 도움이 된다.
- 채팅앱 같은데에서 친구 한 명이 온라인인지 아닌지를 표시하는 컴포넌트의 예시를 생각해 본다면

```jsx
 componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

- 클래스 컴포넌트에서 클린업이 진행되는 로직을 생각해 보면, 대충 componentDidMount랑 componentWillUnmount 생명주기 메서드를 사용해서 해결할 것인데, 컴포넌트가 unmount가 되기 이전에 friend prop이 변한다면 컴포넌트는 다른 친구의 온라인상태를 또 하나 더 구독에 추가해서 표시하게 된다.(기존 구독이 해제되지 않고 구독만 더 들어난다.)
- 마운트 해제가 일어날 동안에는 구독 해지 호출이 다른 친구 ID를 사용하기 때문에 막,, 특정 구독이 해제되지 않거나 하는 문제(메모리 누수)에서도 자유롭지 못하다. => componentDidUpdate를 사용해 friend prop이 바뀌는 순간에 구독을 해지하고 새 구독을 만드는 방법으로 해결할 수 있다. => 이미 번거롭다.....
- 훅을 사용하면 update, mount 개념 없이 일관성있게 이팩트가 실행되기 때문에 버그가 없어진다. 그래서 클래스 컴넌에서는 흔히 업데이트 로직을 빼먹으면서 발생할 수 있는 버그가 예방된다.

```jsx
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // 렌더링이 다시 된다면 매번 해제된다 => 굳이 중간 과정을 생각할 필요도 없다
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  },[props.friend.id]);
```

#### [3-2-5) effect를 잘 사용하는 팁](https://ko.reactjs.org/docs/hooks-effect.html#tips-for-using-effects)

- **관심사를 구분하려고 한다면 effect를 여러개 써라** : 훅이 탄생하게 된 동기가 된 문제 중 하나는 생명주기 class 메서드가 관련이 없는 로직들을 모아놓고, 관련 있는 로직들은 여러개의 메서드에 나누어놓는 정신없는 구조를 만들어내는 경우가 있다는 것. **여정이 아니라 결과와 의존성에 따라!**
- **성능 최적화를 잘 해라** : 모든 렌더링 이후에 effect를 정리하거나 적용하는 것이 성능 저하를 발생시킬 수 있다. 의존성 배열과 return 값 클린업을 이용해서 effect가 필요한 때에만 호출될 수 있도록 유의하기.

#### [3-2-6) effect안으로 함수를 옮기기](https://rinae.dev/posts/a-complete-guide-to-useeffect-ko#%ED%95%A8%EC%88%98%EB%A5%BC-%EC%9D%B4%ED%8E%99%ED%8A%B8-%EC%95%88%EC%9C%BC%EB%A1%9C-%EC%98%AE%EA%B8%B0%EA%B8%B0)

### 3-3) useRef

DOM에 접근하는 훅으로만 알고 있었는데 아니었다

- .current 프로퍼티로 전달된 인자(initiaValue)로 초기화된 변경 가능한 ref 객체를 반환한다. 반환한 객체는 컴포넌트에 계속 살아있다.
- 일반적인 용도는 JSX로 만들어놓은 돔에 직접 접근하는 것이다.(명령적으로)
- 본질적으로 useRef는 .current 프로퍼티에 변경 가능한 값을 갖고 있는 상자와 같다.
- useRef는 **순수 자바스크립트 객체를 생성**한다! 매번 렌더링을 할때마다 동일한 ref객체를 제공한다.

```jsx
function TextInputWithFocusButton() {
  // 아 그리고 객체이기 때문에 const로 변수 선언해도 상관없다
  // 우리는 current에 접근할것이기 때무네
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

- 중요한건 **useRef는 내용이 변경될때 그것을 알려주지는 않는다는 것 + .current 프로퍼티를 변형하는 것이 리렌더링을 발생시키지 않는다는 것**

#### [3-3-1) DOM 접근 말고 다른 용도. 그리고 왜 그렇게 쓸 수 있는지](https://react.vlpt.us/basic/12-variable-with-useRef.html)

- DOM에 접근하는 것 말고도 다른 용도가 하나 있는데 컴포넌트 안에서 조회 및 수정할 수 있는 변수를 관리하는 것.
- 앞에서 말했듯 useRef는 관리하는 변수는 값이 바뀐다고 해서 컴포넌트가 리렌더링 되지 않는다. 리액트 컴포넌트에서의 state는 state를 바꾸는 함수를 호출하고 나서 그 다음 렌더링 이후로 업데이트 된 상태를 조회할 수 있지만, useRef로 관리되는 변수는 **설정 후 바로 조회 가능 => 동기적으로 작동** => 이때문에 리렌더링 없이 바뀐 변수값을 바로 사용해야할 때 쓰인다.
- 이 useRef를 이용해서 setTimeOut, setInterval을 통해서 만들어진 ID라거나, 외부 라이브러리를 사용하여 생성된 인스턴스라거나, scroll 위치 등을 관리할 수 있다.

#### [3-3-2 왜 굳이 useRef으로 렌더링과 상관없는 변수를 만드는거임? let으로 하면 안됨?](https://velog.io/@pks787/useRef-vs-variable-useState-%EC%B0%A8%EC%9D%B4%EC%A0%90)

컴포넌트 내부와 외부에서 일반 변수 선언을 지양해야 하는 이유가 크게 두 가지다.  

1. 함수 컴포넌트 내부에서 일반 변수 => 일반 키워드로 변수를 선언하면 컴포넌트가 렌더링 될때마다 초기화되며 불필요한 동작을 야기시킨다.
2. 함수 컴포넌트 외부의 일반 변수 => 여러 곳에서 사용되는 컴포넌트 인스턴스의 경우 해당 변수를 인스턴스 간에 공유하게 될 수 있다.

- useRef훅은 크게 Accessing the dom node와 keeping a mutable variable 하는데 쓰인다. => 뭔가 컴포넌트 안에서 변수를 유지시키고 싶은데 렌더링이랑은 자유로운 변수를 만들고 싶어질때가 이따..
- useRef는 일반적인 자바스크립트 객체라서 메모리 heap 영역에 저장된다 => 사실 이게 전 생애주기에서 계속 살아있는 이유다.
- 그래서 어플리케이션이 종료되거나 가비지 컬렉팅이 될때까지 참조할때마다 같은 메모리 주소를 가지게 되고, 같은 메모리 주소를 가지기 때문에 ===가 항상 true고 값이 바뀌어도 리렌더링 되지 않음(변수 자체가)
- 하지만 함수 컴넌 내부에 변수를 선언한다면, [렌더링 될때마다 값이 항상 초기화가 되고(undefined 할당) 새로운 변수가 만들어진다.](https://ui.dev/useref/) 매 렌더링때마다 유지가 안되는 것임.
- 그리고 만약 어떤 변수를 컴포넌트 바깥에다 전역변수처럼 선언했는데 컴포넌트가 싱글톤이 아니고 여러번 쓰인다면, [일반 키워드로 컴포넌트 안에서 변수를 선언하면 모든 인스턴스가 변수를 공유하는 불상사가 발생한다.](https://markoskon.com/the-difference-between-refs-and-variables/)

```jsx
let counterOutside = 0;
const Counter = () => {
  const [counter, setCounter] = useState(0);
  console.log(counterOutside);
  return (
    <p>
      The counter is {counter}{" "}
      <button
        onClick={() => {
          // 이걸로 컴포넌트 밖 변수에 접근해서 값을 바꿀 수도 있는데
          // 이 부수효과는 모든 인스턴스에 전파된다.
          setCounter(counter + 1);
          counterOutside = counterOutside + 1;
        }}
      >
        +
      </button>
    </p>
  );
};

export default Counter;
```

- 사실 생각해보면 3-3 단락에 설명이 다 있다.
- 여담으로는 클래스 컴포넌트에서는 인스턴스 변수를 사용하면 렌더링에서 자유로운 변수를 사용할 수 있었다.

### [3-4) useReducer](https://ko.reactjs.org/docs/hooks-reference.html#usereducer)

더 쉬운 상태관리를 위한 훅 1  
미니 리덕스를 컴포넌트 단에 달아주는 훅  

```jsx
const initialState = {count: 0};
function reducer(state, action) {

  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  // 인자로 리듀서와 state 초기값
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

- useState를 대체하는 함수. `(state, action) => newState`의 형태로 reducer을 받고 dispatch 메서드와 짝의 형태로 state를 반환한다.
- 다수의 하윗값을 포함하는 복잡한 정적 로직을 만드는 경우나 다음 state가 이전 state에 의존적인 경우에 더 선호된다. 참조가 더 쉽고 변화하는 로직을 한꺼번에 선언 가능하기 때문에.
- 그리고 useReducer는 자세한 업데이트를 트리거하는 컴포넌트의 성능을 최적화할 수 있게 하는데, 콜백 대신에 dispatch를 전달하기 때문
- 디스패치 함수의 동일성이 안정적이고 리렌더링 시에도 변경되지 않는 것을 보장하기 때문에 최적화에 용이함(의존성 배열들에 넘길 필요가 없음)
- 음,,, 생각
- 리듀서에서 현재 state와 동일한 값을 반환하는 경우 React는 자식을 리렌더링하거나 effect를 발생하지 않고 이것들을 회피한다.

#### [3-4-1) useReducer의 특히 멋진 점](https://rinae.dev/posts/a-complete-guide-to-useeffect-ko#%EC%99%9C-usereducer%EA%B0%80-hooks%EC%9D%98-%EC%B9%98%ED%8A%B8-%EB%AA%A8%EB%93%9C%EC%9D%B8%EA%B0%80)

```jsx
function Counter({ step }) {
  const [count, dispatch] = useReducer(reducer, 0);

  // prop을 참조하고 있다
  // 컴포넌트 내부에 있으니 여러 변수 두루두루 참조하기가 편하다
  function reducer(state, action) {
    if (action.type === 'tick') {
      return state + step;
    } else {
      throw new Error();
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [/* dispatch */]);

  return <h1>{count}</h1>;
}
```

- 만약에 props가 useEffect의 의존성 배열에 필요하다고 할 때, 이걸 useEffect를 속이지 않으면서 의존성 배열에서 제외시킬 수 없을까?
- 리듀서 그 자체를 컴포넌트 안에 정의하여 props를 읽도록 하면 피할 수 있다(리듀서 안에서 props에 접근이 가능하다.)
- **업데이트 로직과 그로 인해 무엇이 일어나는지 서술하는 것이 분리될 수 있도록 만들어준다.** 근데 뭐 이건 상태관리 앱의 장점이기도 하니깐 뭐 새로운 사실은 아니고
- 의존성 배열 안에는 dispatch가 들어간다고 쓸 수도 있고, 뺄 수도 있다 dispatch는 렌더링간 계속 동일하기 때문이다. + 이팩트의 불필요한 의존성을 제거한다(정확히 말하면 리듀서에 위임하는 느낌)

#### 3-4-2 state 변경의 주도권을 리듀서로 가져온다.

- 이게 뭐.. 주도권의 이전이 상태관리 앱의 컨셉이기도 하지만 컴포넌트 안에 리듀서를 다는 특이한 방법을 써서 상태관리를 하는 useReducer니깐 useState와 대응해서 설명하면 좋을 것 같다.
- [리액트 공식문서](https://ko.reactjs.org/docs/hooks-reference.html#usereducer)에는 useReducer가 useState를 완벽히 대체할 수 있다고 설명하고 있다.
- useState를 사용했을 때는 set으로 시작하는 함수가 state를 바꾸는 주체다. useReducer를 사용했을 때는 리듀서가 state를 바꿔준다.
- useState : 이펙트나 이벤트 핸들러에서 set으로 state를 바꿈 => 재랜더링 => 의존성 배열에 맞는 이펙트 실행
- useEffect : 이펙트나 이벤트 핸들러에서 dispatch를 통해 action을 호출하고 state를 바꿈 => 재랜더링 => 의존성 배열에 맞는 이펙트 실행
- 리듀서 안에서 선언한 state 변수는 dispatch와 함께 컴포넌트 밖에서도 꺼내쓸 수 있기 때문에 useEffect의 의존성 배열에도 넣을 수 있다.
- Redux와 다른 점을 뽑자면, 리덕스는 드랍쉽 같아서 useSelector를 사용해서 어느 컴포넌트든 연결이 가능하지만 useReducer은 컴포넌트에 의존하고 있어서(컴포넌트 내부의 함수, 즉 함수의 함수) 어쩌면 스코프가 더 좁다. 
- 애초에 useState를 대체하는 방식으로 useReducer을 고안한 것이니, 전역 상태관리가 안 되는게 정상이긴 하다. 
- **튜토리얼 2)** 그럼 리듀서 함수를 따로 빼고 여러 컴포넌트에서 사용하는건 가능할까? 이때는 리듀서가 쌉 **순수해야** 가능하다. 컴포넌트 내부의 변수는 payload로 주입해주지 않는 이상 못쓴다. 오 근데 이러면 그냥 리덕스 아님?
- 비동기는 리덕스가 그렇듯 리듀서 안에서 하기는 힘들 것 같고 지저분한 로직이 되기 십상일 것 같다. useEffect에서 비동기 처리하고 payload로 리듀서에게 넘겨주는 방식이 좋을 것 같다.

```jsx
// 이렇게 디스패치를 발생시키면
dispatch({ type: 'DELETE_FILE', file: state.deleteFile });

// 액션 객체를 이렇게 참조할 수 있다.
case 'DELETE_FILE':
  const index = state.files.indexOf(action.file);
  return {...state, files:[...]}
```

### 3-5) useContext

더 쉬운 상태관리를 위한 훅 2

- context 객체를 받아 그 context의 현재값을 반환함.
- context의 현재 값은 트리 안에서 이 Hook을 호출하는 컴포넌트에 가장 가까이에 있는 provider의 value prop에 의해 결정됨
- 컴포넌트에 가장 가까운 provider가 갱신되면 이 Hook은 MyContext provider에 전달된 가장 최신의 context value를 사용하여 렌더러를 트리거한다.
- 상위 컴포넌트에서 memo나 shouldComponentUpdate를 사용하고 있더라도 useContext를 사용하고 있는 컴포넌트 자체에서부터 다시 렌더링이 됨.
- useContext로 전달한 인자는 context 객체 그 자체여야 함.

```jsx
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

// context를 만드는 API는 React에서 꺼내서 사용
const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    // 프로바이더 사용하기
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 프로바이더의 타겟이 되는 컴포넌트
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

// 의 자식 컴포넌트
function ThemedButton() {
  // 받기!(context이름을 참조) => 요거 import해서 받아야되겠네?
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

- **튜토리얼 3)** context 의존성은 약간 커스텀 훅처럼 사용하면 해결될 수 있을 것 같긴 하다. useReducer까지 써준다면 같은 파일에 선언하면 더 좋겠다.

```jsx
// src/context/todo.ts => 다른 디렉토리에 컨텍스트를 마련하기

const todoContextValue = {
  value: '뿡'
}

// provider의 value 인자로
export const TodoContext = createContext(todoContextValue)

// consumer의 context 참조용으로
export const useTodoContext = () => useContext(TodoContext)
```

- 그냥 useContext만 사용할때 자식 컴넌에서 프로바이더의 상태를 바꿀 수 있는건가? context로 함수를 내려서 함수를 자식에서 실행하는 방법으로 얼추 되는듯. 
- 근데 그렇게 일일히 넣어주기가 불편하고, 상태를 변경할 필요가 없는 중간 컴포넌트에까지 변경 함수를 전파하는게 약간 좀 오버킬인듯 보인다.
- 그래서 dispatch로 손쉽게 state 변경이 가능한 useReducer랑 함께 쓰면 더 좋다. hook으로만 상태관리 할 때는 이 두 훅이 정말 뗄레야 뗄 수 없을 듯 싶다.

#### 3-5-1) Context API 복습

- 컴포넌트 트리 전체에 데이터를 제공하는 방법. **컴포넌트 트리 안에서** 전역적이라고 볼 수 있는 데이터를 공유할 수 있도록 고안된 방법이다.
- context를 사용하면 중간에 있는 엘리먼트들에게 props를 넘겨주지 않아도 괜찮다.
- context를 사용하면 컴포넌트를 재사용하기 어려워진다. context는 트리에 의존하기 때문에 context의 consumer인 컴포넌트를 트리 바깥에서 context의 의존성 free하게 사용할 수 없기 때문이다. => 개인적으로 이거 때문에 진짜 쓰기 싫었다
- 컴포넌트 트리의 리프 컴포넌트들을 dumb 컴포넌트로 만든고, 개별 컴포넌트 트리 안에서 어떤 맥락의 context를 사용하는지 파악을 계속 해야 버그를 방지할 수 있을 것이다. 그리고 useContext 훅이 나오면서 조금은 괜찮아졌지만 타이핑도 꽤 번거롭다.. redux로 물량전을 할 수 있는데 굳이 context로 각개전투 하는 느낌이랄까
- 그리고 그럴 일이 많지는 않지만 여러개의 provider가 있을 경우 모양이 좀...

```jsx
// 으으..
 <TestContext.Provider value='hello'>
    <TestContext2.Provider value='world!'>
      <UseContextExample />
    </TestContext2.Provider>
  </TestContext.Provider>
```

- 그리고 대안도 많다. 컴포넌트 자체를 prop으로 넘겨주는 [컴포넌트 합성이라던지](https://ko.reactjs.org/docs/context.html#before-you-use-context)

#### 3-5-1) useReducer와 합체

리듀서에 날개를 달아줘요!

- 두 훅을 같이 쓰면 꽤 재미있는 구조가 만들어진다. 하나의 컴포넌트 렌더 트리 최상위에 가까운 곳에서 Reducer을 선언하고 provider 만들어서 해당 컴포넌트 하위의 모든 컴포넌트들이 consumer로서 reducer을 공유하게끔 하는 것이다. 

```jsx
// 부모(provider)
const MyContext = React.createContext();

export default function App() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { todos, isLoggedIn } = state;
  return (
    // state와 dispatch를 같이 context로 넘긴다.
    <MyContext.Provider value={{ state, dispatch }}>
      <div className="App useContext">
        <TodoPage todos={todos} dispatch={dispatch} isLoggedIn={isLoggedIn} />
      </div>
    </MyContext.Provider>
  );
}

// 자식(consumer)
function TodoItem({ title, completed }) {
  const { state, dispatch } = useContext(MyContext);
  const { isLoggedIn } = state;
  return (
    <div className="todoItem">
      <p>{title}</p>
      <div>
        <input
          type="checkbox"
          checked={completed}
          onClick={() => {
            if (!isLoggedIn) {
              alert('Please login to click this!');
            }
          }}
          onChange={() => {
            // 이런식으로 하위 컴넌에서 직접 디스패치를 부르는게 가능해진다.
            if (isLoggedIn) {
              dispatch({ type: 'toggleTodoCompleted', payload: title });
            }
          }}
        />
      </div>
    </div>
  );
}
```

#### 3-5-3) useReducer + useContext 최적화 팁

- 최적화 공부한 뒤에 다시 돌아오겠따

### 3-6) useMemo

```jsx
// 이 값을 실질적으로 사용한다
const count = useMemo(() => countActiveUsers(users), [users]);
```

- 메모이제이션된 **값**을 반환한다. => 첫번째 파라미터에는 어떻게 연산할지 정의하는 함수를 넣어주면 되고, 두번째는 의존성 배열을 넣어준다. 이 배열 안에 넣은 내용이 바뀌면 등록한 함수를 호출해서 값을 연산하고, 내용이 바뀌지 않았다면 이전 값 재사용
- useMemo는 의존성 배열이 변경되었을 때만 메모이제이션된 값만 다시 계산한다. 모든 렌더링 시의 고비용 계산을 방지한다.
- useMemo로 전달된 함수는 렌더링 중에 실행된다. 통상적으로 렌더링 중에는 하지 않는 것은 useMemo 콜백에서 안하는게 좋다. 사이드 이펙트같은거는 useEffect의 일이다.
- 배열이 없는 경우 매 렌더링마다 새 값을 계산한다.
- useMemo는 성능 최적화를 위해 사용할 수 있지만 **이를 보장하는 것은 아니다.** useMemo를 사용하지 않고도 동작할 수 있는 코드를 작성하고, useMemo를 추가하여 성능을 최적화해라
- 기본적으로는 input시 재랜더링될때 useMemo를 사용하는 식으로 최적화를 하는 예제가 보편적이다.

#### 3-6-1) 실질적인 사용법

#### 3-6-2) useRef같은 다른 훅이랑 사용할 수 있는건가

### 3-7) useCallback

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

- 메모이제이션된 **콜백**을 반환한다. 메모이제이션된 콜백
- 콜백이, 컴포넌트 내의 함수가 렌더링 할 때마다 모두 달라지는데 그 동작을 방지한다. 의존성 배열의 값들이 달라지지 않았다면 이전의 그 함수를 그대로 이용한다.


- **튜토리얼 4** : 그냥 잘 돌아가는 컴포넌트 useCallback과 useMemo로 최적화하기

#### 3-7-1) 이른 최적화는 뭐고 그래서 언제 써야 올바른가?

### 3-8) 기타 내장 훅


## 훅 만들기