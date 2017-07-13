import { SubmissionError } from 'redux-form'

import * as cardActions from './cards'
import * as slideActions from './slides'
import * as productActions from './products'

export const type = 'SECTION'
const route = 'sections'

const ADD = `ADD_${type}`
const REQUEST = `REQUEST_${type}S`
const RECEIVE = `RECEIVE_${type}S`
const UPDATE = `UPDATE_${type}`
const DELETE = `DELETE_${type}`
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
        dispatch(fetchAddSuccess(json))
      })
      .catch(err => {
        dispatch(fetchAddFailure(err))
        throw new SubmissionError({ ...err, _error: 'Update failed!' })
    })
  }
}



// Read
const fetchSectionsRequest = () => ({ type: REQUEST })
const fetchSectionsSuccess = (items) => ({ type: RECEIVE, items })
const fetchSectionsFailure = (error) => ({ type: ERROR, error })
export const fetchSections = () => {
  return (dispatch, getState) => {
    dispatch(fetchSectionsRequest())
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
        dispatch(fetchSectionsSuccess(json))
      })
      .catch(err => {
        console.log(err)
        dispatch(fetchSectionsFailure(err))
      })
  }
}



// Update
export const fetchUpdateSuccess = (item) => ({ type: UPDATE, item })
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
        const { _id, componentType, components } = json
        if (componentType) {
          switch(componentType) {
            case 'Card':
              return dispatch(cardActions.deletes(components.map(comp => comp.componentId)))
            case 'Product':
              return dispatch(productActions.deletes(components.map(comp => comp.componentId)))
            case 'Slide':
              return dispatch(slideActions.deletes(components.map(comp => comp.componentId)))
            default:
              return
          }
        }
        dispatch(fetchDeleteSuccess(_id))
      })
      .catch(err => {
        console.error(err)
        dispatch(fetchDeleteFailure(err))
        throw new SubmissionError({ ...err, _error: 'Delete failed!' })
      })
  }
}
