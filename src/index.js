import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer

export default function (options = {}) {
  let exitNode = null

  const tagName = typeof options.tagName === 'string'
    ? options.tagName
    : 'div'

  const styles = typeof options.mountPointStyle === 'object'
    ? options.mountPointStyle
    : {}

  const exit = React.createElement(tagName, {
    style: styles,
    ref: instance => {
      exitNode = instance
      while (subscribers.length > 0) {
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
        const content = React.createElement('div', {
          style: props.style,
          ref: onDeref(props.onDestroy)
        }, props.children)

        this.portal = renderSubtreeIntoContainer(this, content, this.exitNode)
      }
    }

    render () {
      return React.DOM.noscript()
    }
  }

  Wormhole.propTypes = {
    onDestroy: PropTypes.func,
    style: PropTypes.object
  }

  return { exit, Wormhole }
}

function onDeref (onDestroy) {
  return function (instance) {
    if (instance == null && typeof onDestroy === 'function') {
      onDestroy()
    }
  }
}
