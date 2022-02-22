import { IPools } from './Types'

const SET_ALL_POOLS = 'SET_ALL_POOLS'

// *** action interface ***
interface SetPoolsAction {
  type: typeof SET_ALL_POOLS
  payload: IPools
}

type poolsActions = SetPoolsAction

// *** action methods ***
export const setAllPools = (payload: IPools): SetPoolsAction => ({
  type: SET_ALL_POOLS,
  payload,
})

export const initialState: IPools = {}

const reducer = (state: IPools, action: poolsActions): IPools => {
  switch (action.type) {
    case SET_ALL_POOLS:
      return action.payload
    default:
      return state
  }
}

export default reducer
