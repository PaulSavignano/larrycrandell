import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './page.css'
import history from '../../containers/routers/history'
import pageContainer from '../../containers/pages/pageContainer'
import renderSections from './renderSections'

class Page extends Component {
  componentDidMount() {
    const { hash } = window.location
    console.log('mounted', history)
    if (hash) return this.scrollToId(hash)
    window.scrollTo(0, 0)
  }
  componentWillReceiveProps({ page: { _id }}) {
    const { hash } = window.location
    if (this.props.page._id !== _id) {
      console.log('updating', history)
      if (hash) return this.scrollToId(hash)
      window.scrollTo(0, 0)
    }

  }
  scrollToId = (hash) => {
    const id = hash.replace('#', '')
    const element = document.getElementById(id)
    if (element) return element.scrollIntoView({ block: "start", behavior: "smooth" })
  }
  render() {
    const {
      dispatch,
      page: { _id, slug, sections }
    } = this.props
    return (
      <div className="Page">
        {renderSections({
          dispatch,
          sections,
          pageId: _id,
          pageSlug: slug
        })}
      </div>
    )
  }
}

Page.propTypes = {
  page: PropTypes.object.isRequired,
}

export default pageContainer(Page)
