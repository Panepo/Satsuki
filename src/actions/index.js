import * as types from '../constants/ConstActionTypes'

export function modelSelect(value) {
  return {
    type: types.MODEL_SELECT,
    value
  }
}
