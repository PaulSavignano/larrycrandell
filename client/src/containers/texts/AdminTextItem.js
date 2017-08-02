import React, { Component } from 'react'
import { connect } from 'react-redux'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import renderHTML from 'react-render-html'
import { Card, CardMedia, CardText } from 'material-ui/Card'

import AdminTextEdit from './AdminTextEdit'
import { startEdit } from '../../actions/texts'

class AdminTextItem extends Component {
  render() {
    const { dispatch, item, isFetching, values } = this.props
    const {
      backgroundColor,
      flex,
      margin,
      padding,
      text,
      width,
    } = values
    return (
      !isFetching &&
      <Card
        onTouchTap={() => dispatch(startEdit(item._id))}
        style={{ backgroundColor, flex, margin, width, cursor: 'pointer' }}
        zDepth={0}
      >
        <div style={{ padding }}>{renderHTML(text)}</div>
        {item.editing && <AdminTextEdit item={item} />}
      </Card>
    )
  }
}

const mapStateToProps = ({ texts: { items, isFetching } }, { componentId }) => {
  const item = items.find(item => item._id === componentId) || {}
  const values = item.values || {}
  return {
    item,
    isFetching,
    values
  }
}

export default connect(mapStateToProps)(AdminTextItem)
