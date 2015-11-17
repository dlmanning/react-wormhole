import React, { Component, PropTypes } from 'react'
import makePair from 'react-wormhole'

const { exit, Wormhole } = makePair({ mountPointStyle: {
  color: 'yellow'
}})

export default class App extends Component {
  constructor () {
    super()
    this.state = { counter: 0 }
  }

  componentDidMount () {
    setInterval(() => {
      if (this.state.counter < 3) {
        console.groupEnd()
        console.group('Counter: %s', this.state.counter + 1)
        this.setState({ counter: this.state.counter + 1 })
      }
    }, 1500)
  }

  render () {
    return (
      <div>
        <h1>{this.state.counter}</h1>
        {exit}
        <Widget counter={this.state.counter}/>
      </div>
    )
  }
}

class Widget extends Component {
  render () {
    const content = this.props.counter % 2 === 0
      ? (
        <Wormhole ref={firstPortalReferee}>
          <FastClock />
        </Wormhole>
      )
      : null

    return (
      <div>
        <Wormhole ref={secondPortalReferee} counter={this.props.counter}>
          <h1 style={{backgroundColor: 'green'}}>{this.props.counter}</h1>
        </Wormhole>
        { content }
      </div>
    )
  }
}

Widget.propTypes = { counter: PropTypes.number }

function firstPortalReferee (instance) {
  if (instance == null) {
    console.log('First Portal is unmounting')
  } else {
    console.log('First Portal is mounting')
  }
}

function secondPortalReferee (instance) {
  if (instance == null) {
    console.log('Second Portal is unmounting')
  } else {
    console.log('Second Portal is mounting')
  }
}

class FastClock extends Component {
  constructor () {
    super()
    this.state = { counter: 0 }
  }

  componentDidMount () {
    console.log('FastClock mounted')
    this.intervalId = setInterval(() => {
      this.setState({ counter: this.state.counter + 1 })
    }, 100)
  }

  componentWillUnmount () {
    console.log('FastClock is unmounting')
    clearInterval(this.intervalId)
  }

  render () {
    return <div style={{backgroundColor: 'red'}}>{this.state.counter}</div>
  }
}
