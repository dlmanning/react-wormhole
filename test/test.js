import React from 'react'
import { render } from 'react-dom'
import { jsdom } from 'jsdom'
import test from 'tape'
import makeWormhole from '../src'

const { exit, Wormhole } = makeWormhole()
const document = jsdom('<html><body><div id="app"></div><body></html>')
global.window = document.defaultView

const App = () =>
  <Container ref={_ => console.log(_)}>
    <Widget />
  </Container>

class Container extends React.Component {
  render () {
    return (
      <div id='container'>
        {this.props.children}
        <div id='mount-point'>
          {exit}
        </div>
      </div>
    )
  }
}

Container.propTypes = {
  children: React.PropTypes.node
}

const Widget = () =>
  <div id='widget'>
    <h1>Hello World</h1>
    <Wormhole ref={instance => runTests(instance)}>
      <h1 id='transported'>We come in peace</h1>
    </Wormhole>
  </div>

render(<App />, document.querySelector('#app'))

function runTests (instance) {
  test('existential', t => {
    t.ok(React.isValidElement(exit), 'exit is a react element')
    t.ok(typeof Wormhole === 'function', 'Wormhole is a component')
    t.end()
  })

  test('wormhole', t => {
    t.ok(instance.state.open, 'wormhole is open')
    t.ok(document.contains(instance.exitNode), 'wormhole received exit node')
    t.end()
  })

  test('render', t => {
    const mountPoint = document.getElementById('mount-point')
    const widget = document.getElementById('widget')
    const transported = document.getElementById('transported')

    t.ok(mountPoint != null, 'Mount point rendered')
    t.ok(widget != null, 'Widget rendered')
    t.ok(transported != null, 'Transported content rendered')

    t.ok(mountPoint.contains(transported), 'Transported content rendered under mount point')
    t.ok(!widget.contains(transported), 'Transported content not rendered under <Wormhole>')
    t.end()
  })
}
