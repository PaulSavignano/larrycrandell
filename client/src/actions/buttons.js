import { SubmissionError } from 'redux-form'

import * as sectionActions from './sections'

export const type = 'BUTTON'
const route = 'buttons'

const START_EDIT = `START_EDIT_${type}`
const STOP_EDIT = `STOP_EDIT_${type}`
const ADD = `ADD_${type}`
const REQUEST = `REQUEST_${type}S`
const RECEIVE = `RECEIVE_${type}S`
const UPDATE = `UPDATE_${type}`
const DELETE = `DELETE_${type}`
const DELETES = `DELETE_${type}S`
const ERROR = `ERROR_${type}`

// Create
const fetchAddSuccess = (item) => ({ type: ADD, item })
const fetchAddFailure = (error) => ({ type: ERROR, error })
export const fetchAdd = (add) => {
  return (dispatch, getState) => {
    return fetch(`/api/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': localStorage.getItem('token'),
      },
      body: JSON.stringify(add)
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Network response was not ok.')
      })
      .then(json => {
        if (json.error) return Promise.reject(json.error)
        const { button, section } = json
        dispatch(fetchAddSuccess(button))
        dispatch(sectionActions.fetchUpdateSuccess(section))
      })
      .catch(err => {
        dispatch(fetchAddFailure(err))
        throw new SubmissionError({ ...err, _error: 'Update failed!' })
    })
  }
}



// Read
const fetchButtonsRequest = () => ({ type: REQUEST })
const fetchButtonsSuccess = (items) => ({ type: RECEIVE, items })
const fetchButtonsFailure = (error) => ({ type: ERROR, error })
export const fetchButtons = () => {
  return (dispatch, getState) => {
    dispatch(fetchButtonsRequest())
    return fetch(`/api/${route}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Network response was not ok.')
      })
      .then(json => {
        if (json.error) return Promise.reject(json.error)
        dispatch(fetchButtonsSuccess(json))
      })
      .catch(err => {
        dispatch(fetchButtonsFailure(err))
      })
  }
}



// Update
const fetchUpdateSuccess = (item) => ({ type: UPDATE, item })
const fetchUpdateFailure = (error) => ({ type: ERROR, error })
export const fetchUpdate = (_id, update) => {
  return (dispatch, getState) => {
    return fetch(`/api/${route}/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json' ,
        'x-auth': localStorage.getItem('token'),
      },
      body: JSON.stringify(update)
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Network response was not ok.')
      })
      .then(json => {
        if (json.error) return Promise.reject(json.error)
        dispatch(fetchUpdateSuccess(json))
      })
      .catch(err => {
        dispatch(fetchUpdateFailure(err))
        throw new SubmissionError({ ...err, _error: 'Update failed!' })
      })
  }
}



// Delete
const fetchDeleteSuccess = (_id) => ({ type: DELETE, _id })
const fetchDeleteFailure = (error) => ({ type: ERROR, error })
export const fetchDelete = (_id) => {
  return (dispatch, getState) => {
    return fetch(`/api/${route}/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': localStorage.getItem('token'),
      },
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Network response was not ok.')
      })
      .then(json => {
        if (json.error) return Promise.reject(json.error)
        const { button, section } = json
        dispatch(sectionActions.fetchUpdateSuccess(section))
        dispatch(fetchDeleteSuccess(button._id))
      })
      .catch(err => {
        dispatch(fetchDeleteFailure(err))
        throw new SubmissionError({ ...err, _error: 'Delete failed!' })
      })
  }
}

export const deletes = (items) => {
  return {
    type: DELETES,
    items
  }
}


export const startEdit = (_id) => ({ type: START_EDIT, _id })
export const stopEdit = (_id) => ({ type: STOP_EDIT, _id })
