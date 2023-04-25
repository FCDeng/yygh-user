import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userid: '',
  username: '',
  token: '',
  roles: [],
  patientStateValue: 0,
  patientStateIndex: 0,
  userStateValue: 0,
  userStateIndex: 0,
  code: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER: (state, { payload }) => {
      state.username = payload.username
      state.userid = payload.userid
      state.roles = payload.roles
    },
    SET_TOKEN: (state, { payload }) => {
      state.token = payload.token
    },
    USER_LOGOUT: (state) => {
      state.userid = initialState.userid
      state.username = initialState.username
    },
    SET_PatientStateValue: (state, { payload }) => {
      console.log(payload);
      state.patientStateValue = payload.patientStateValue
    },
    SET_PatientStateIndex: (state, { payload }) => {
      state.patientStateIndex = payload.patientStateIndex
    },
    SET_UserStateValue: (state, { payload }) => {
      state.userStateValue = payload.userStateValue
    },
    SET_UserStateIndex: (state, { payload }) => {
      state.userStateIndex = payload.userStateIndex
    },
    SET_Code: (state, { payload }) => {
      state.code = payload.code
    },
  },
})

export const { SET_USER, SET_TOKEN, USER_LOGOUT, SET_PatientStateValue, 
  SET_PatientStateIndex, SET_UserStateValue, SET_UserStateIndex, SET_Code } = userSlice.actions

export default userSlice.reducer
