// 컴포넌트 내부의 prop이나 다른 변수에 의존성이 없는 순수한 리듀서 함수는
// 이렇게 밖으로 빼서도 쓸 수 있다.
// 근데 이건 그냥 리덕스자나

interface state {
  value:number
}

interface action {
  type: 'sum' | 'min'
  payload : number
}

function reducer(state:state, action:action) {
  switch (action.type) {
    case 'sum':
      return {...state, value:action.payload + state.value}
    case 'min':
      return {...state, value:state.value - action.payload}
    default:
      return {...state}
  }
}

export default reducer