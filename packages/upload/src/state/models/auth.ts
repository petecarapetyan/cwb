import { createModel } from '@captaincodeman/rdx'
import { State } from '../store'
import { createSelector } from 'reselect'

export type User = import('firebase').UserInfo

export interface AuthState {
  user: User | null
  statusKnown: boolean
}

export default createModel({
  state: <AuthState>{
    user: null,
    statusKnown: false,
  },

  reducers: {
  },
})


const getState = (state: State) => state.auth

export namespace AuthSelectors {
  export const user = createSelector(
    [getState],
    (state) => state.user
  )

  export const statusKnown = createSelector(
    [getState],
    (state) => state.statusKnown
  )

  export const anonymous = createSelector(
    [user],
    (user) => user === null
  )

  export const authenticated = createSelector(
    [user],
    (user) => user !== null
  )
}
