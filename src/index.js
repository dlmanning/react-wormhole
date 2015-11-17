import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer

export default function (tagName = 'div') {
  let exitNode = null

  const exit = React.createElement(tagName, {
    ref: instance => {
      exitNode = instance
      while (subscribers.length) {
        subscribers.pop()(instance)
      }
    }
  })

  const subscribers = []
  const subscribe = cb => subscribers.push(cb)

  class Wormhole extends Component {
    constructor () {
      super()
      this.exitNode = exitNode

      if (this.exitNode == null) {
        subscribe(_ => this.openPortal(_))
        this.state = { open: false }
      } else {
        this.state = { open: true }
      }
    }

    componentDidMount () {
      this.renderToPortal(this.props, this.state)
    }

    componentDidUpdate () {
      this.renderToPortal(this.props, this.state)
    }

    componentWillUnmount () {
      if (this.portal) {
        ReactDOM.unmountComponentAtNode(this.exitNode)
      }
    }

    openPortal (exitNode) {
      this.exitNode = exitNode
      this.setState({ open: true })
    }

    renderToPortal (props, state) {
      if (this.exitNode != null && state.open) {
        const content = <div ref={onDeref(props.onDestroy)}>{props.children}</div>
        this.portal = renderSubtreeIntoContainer(this, content, this.exitNode)
      }
    }

    render () {
      return React.DOM.noscript()
    }
  }

  Wormhole.propTypes = { onDestroy: PropTypes.func }

  return { exit, Wormhole }
}

function onDeref (onDestroy) {
  return function (instance) {
    if (instance == null && typeof onDestroy === 'function') {
      onDestroy()
    }
  }
}
