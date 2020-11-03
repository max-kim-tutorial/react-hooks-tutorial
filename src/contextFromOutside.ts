import { createContext, useContext, Dispatch } from 'react'

// reducer의 state와 action type, Context의 타입 정리
interface StateType {
  value: number
}

interface ActionType {
  type: 'add' | 'mul'
  payload: number
}

export interface TutorialContextType {
  state:StateType,
  dispatch:Dispatch<ActionType>
}


// 초기상태 정의
export const initialState:StateType = {
  value: 0
}

// reducer 함수 선언
export const reducer = (state:StateType, action:ActionType) => {
  switch(action.type) {
    case 'add':
      return {...state, value: action.payload + state.value}
    case 'mul':
      return {...state, value: state.value - action.payload}
    default:
      return {...state}
  }
}

// context를 쓸 수 있게 하는 create Context와 context를 끼운 훅
// provider을 사용하지 않았을 때는 Context의 값이 undefined가 되어야 하므로
export const TutorialContext = createContext<TutorialContextType | null>(null)

// 프로바이더를 사용할때는 무조건 컨텍스트 타입
// 제네릭의 위치에 대해 감을 잡아야 할 것같다
export const useTutorialContext = () => useContext(TutorialContext) as TutorialContextType
