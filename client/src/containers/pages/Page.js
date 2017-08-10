import React, { Component } from 'react'

import pageContainer from './pageContainer'
import SectionList from '../../containers/sections/SectionList'

class Page extends Component {
  componentWillMount() {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash)
      if (target) target.scrollIntoView()
    } else {
      window.scrollTo(0,0)
    }
  }
  render() {
    const { sections } = this.props
    return (
      <SectionList items={sections} />
    )
  }
}


export default pageContainer(Page)
