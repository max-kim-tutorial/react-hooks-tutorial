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

- 그렇다고 해서 클래스 기반 컴넌을 없애려는게 아니다.
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

### 3-1) useState

함수형 컴포넌트에 렌더링을 불러일으키는 상태값을 연동

#### 3-1-1) 어떻게 이 간단한 함수가 컴포넌트의 state를 기록하고 변화를 추적하나?

#### 3-1-2) 비동기로 동작한다는데?? 

### 3-2) useEffect

부수효과와 관련된 로직을 **죄다** 해결하는 부수효과 마스터

#### 3-2-1) 생명주기와는 완전 다른 useEffect 패러다임

#### 3-2-2) 의존성 배열과 관련한 썰

#### 3-2-3) 리액트 팀이 원했던 생명주기의 대체

### 3-3) useRef

DOM에 접근해보셈

#### 3-3-1) DOM 접근 말고 다른 용도. 그리고 왜 그렇게 쓸 수 있는지