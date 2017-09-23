import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import history from '../../containers/routers/history'
import userContainer from '../../containers/user/userContainer'
import SuccessableButton from '../buttons/SuccessableButton'
import renderTextField from '../../components/fields/renderTextField'
import { fetchReset } from '../../actions/user'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'password', 'passwordConfirm' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match'
  }
  return errors
}

class Reset extends Component {
  state = {
    open: false,
    message: null
  }
  handleClose = () => {
    const { error } = this.props
    this.setState({open: false})
    if (error) {
      history.push('/user/recovery')
    } else {
      history.push('/')
    }
  }
  handleFormSubmit = values => {
    const { dispatch, params: { token }} = this.props
    return dispatch(fetchReset(values, token))
  }
  componentWillReceiveProps({ submitFailed, submitSucceeded, user: { values: { firstName }}}) {
    if (submitSucceeded) return this.setState({ open: true, message: `Welcome back ${firstName}` })
    if (submitFailed) return this.setState({ open: true, message: `Your email token has expired, recover again` })
  }
  render() {
    const {
      dirty,
      error,
      handleSubmit,
      submitSucceeded,
      submitting,
      valid
    } = this.props
    return (
      <div className="page">
        <section className="section-margin">
          <Card>
            <CardTitle title="Reset" subtitle="Enter your email to recover your account" />
            <form onSubmit={handleSubmit(this.handleFormSubmit)} className="">
              <CardText>
                <Field name="password" component={renderTextField} label="Password" type="password" fullWidth={true}/>
                <Field name="passwordConfirm" component={renderTextField} label="Password Confirm" type="password" fullWidth={true}/>
              </CardText>
              <div className="button-container">
                <SuccessableButton
                  dirty={dirty}
                  error={error}
                  label="Reset"
                  reset={null}
                  submitSucceeded={submitSucceeded}
                  submitting={submitting}
                  successLabel="Reset Success!"
                  valid={valid}
                />
              </div>
            </form>
            {!this.state.open ? null :
            <Dialog
              actions={
                <FlatButton
                  label="Close"
                  primary={true}
                  onTouchTap={this.handleClose}
                />
              }
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              {this.state.message}
            </Dialog>
            }
          </Card>
        </section>
      </div>
    )
  }
}

Reset.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  submitSucceeded: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
}

export default userContainer(reduxForm({
  form: 'recovery',
  validate
})(Reset))