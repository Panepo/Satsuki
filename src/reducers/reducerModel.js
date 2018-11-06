import { MODEL_SELECT } from '../constants/ConstActionTypes'

const initialState = {
  modelSelected: 1
}

const reducerModel = (state = initialState, action) => {
  switch (action.type) {
    case MODEL_SELECT:
      return Object.assign({}, state, {
        modelSelected: action.value
      })
    default:
      return state
  }
}

export default reducerModel
