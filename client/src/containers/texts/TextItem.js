import React, { Component } from 'react'
import { connect } from 'react-redux'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { push } from 'react-router-redux'
import renderHTML from 'react-render-html'
import { Card, CardMedia, CardText } from 'material-ui/Card'

class TextItem extends Component {
  render() {
    const { dispatch, isFetching, item, values } = this.props
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
      <Card zDepth={0} style={{ backgroundColor, flex, margin, width }}>
        <div style={{ padding }}>{renderHTML(text)}</div>
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

export default connect(mapStateToProps)(TextItem)
