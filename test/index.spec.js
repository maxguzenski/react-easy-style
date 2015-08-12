
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment'
import jsdom from 'mocha-jsdom'

import expect from 'expect'
import EasyStyle from '../src/index'
import React, { Component } from 'react/addons';

const { TestUtils } = React.addons

jsdom()
ExecutionEnvironment.canUseDOM = true

describe('index', () => {

  describe('class name', () => {

    class Comp extends Component {
      render() { return <button ref='btn'/> }
    }

    it('should found classname with root name', () => {
      const css = {root: 'root'}
      const Button = EasyStyle(css)(Comp)
      const node = TestUtils.renderIntoDocument(<Button />)
      expect(node.refs.btn.getDOMNode().className).toEqual('root')
    }),

    it('should found classname with component name', () => {
      const css = {Comp: 'Comp'}
      const Button = EasyStyle(css)(Comp)
      const node = TestUtils.renderIntoDocument(<Button />)
      expect(node.refs.btn.getDOMNode().className).toEqual('Comp')
    }),

    it('should found classname with custom name', () => {
      const css = {myComp: 'myComp'}
      const Button = EasyStyle(css, 'myComp')(Comp)
      const node = TestUtils.renderIntoDocument(<Button />)
      expect(node.refs.btn.getDOMNode().className).toEqual('myComp')
    })
  }),

  describe('about root', () => {
    const css = {
      root: 'root',
      'root--kind-primary': 'root--kind-primary',
      'root--disabled-true': 'root--disabled-true'
    }

    const Button = EasyStyle(css)(
      class Comp extends Component {
        render() { return <button ref='btn'>...</button>}
      }
    )

    it('should has root class', () => {
      const node = TestUtils.renderIntoDocument(<Button />)
      expect(node.refs.btn.getDOMNode().className).toEqual('root')
    })

    it('should has root class and modifiers', () => {
      const node = TestUtils.renderIntoDocument(<Button circle={true} kind='primary' disabled={true} />)
      expect(node.refs.btn.getDOMNode().className).toEqual('root root--kind-primary root--disabled-true')
    })

    it('should has set className', () => {
      const node = TestUtils.renderIntoDocument(<Button className='ex1' />)
      expect(node.refs.btn.getDOMNode().className).toEqual('root  ex1')
    })

    it('should has set rootClasses', () => {
      const node = TestUtils.renderIntoDocument(<Button rootClasses='ex1 ex2' />)
      expect(node.refs.btn.getDOMNode().className).toEqual('root  ex1 ex2')
    })

    it('should has set className and rootClasses', () => {
      const node = TestUtils.renderIntoDocument(<Button rootClasses='ex1 ex2' className='cn1' />)
      expect(node.refs.btn.getDOMNode().className).toEqual('root  ex1 ex2 cn1')
    })
  }),

  describe('about nested', () => {
    const css = {
      root: 'root', 'label': 'label'
    }

    const Button = EasyStyle(css)(
      class Comp extends Component {
        render() { return <button><span ref='lb' is='label' className='in1' style={{margin: 1}}>...</span></button>}
      }
    )

    it('should has label class', () => {
      const node = TestUtils.renderIntoDocument(<Button />)
      expect(node.refs.lb.getDOMNode().className).toEqual('label  in1')
      expect(node.refs.lb.getDOMNode().style.margin).toEqual('1px')
    })

    it('should has set labelClasses', () => {
      const node = TestUtils.renderIntoDocument(<Button labelClasses='ex1 ex2' />)
      expect(node.refs.lb.getDOMNode().className).toEqual('label  in1 ex1 ex2')
    })

    it('should merge labelStyle', () => {
      const node = TestUtils.renderIntoDocument(<Button labelStyle={{margin: 10}} />)
      expect(node.refs.lb.getDOMNode().style.margin).toEqual('10px')
    })

    it('should not has className', () => {
      const node = TestUtils.renderIntoDocument(<Button className='cn1' />)
      expect(node.refs.lb.getDOMNode().className).toEqual('label  in1')
    })
  }),

  describe('about inline styles', () => {
    const css = {
      base: { root: {margin: 10}, label: {padding: 15}},
      'kind-primary': { root: {margin: 20}, label: {padding: 25}}
    }

    const Button = EasyStyle(css)( class Comp extends Component {
      render() { return <button ref='btn'><span is='label' ref='lbl'>..</span></button> }
    })

    it('should has default style', () => {
      const node = TestUtils.renderIntoDocument(<Button />)
      expect(node.refs.btn.getDOMNode().style.margin).toEqual('10px')
      expect(node.refs.lbl.getDOMNode().style.padding).toEqual('15px')
    })

    it('should has style by kind= props ', () => {
      const node = TestUtils.renderIntoDocument(<Button kind='primary' />)
      expect(node.refs.btn.getDOMNode().style.margin).toEqual('20px')
      expect(node.refs.lbl.getDOMNode().style.padding).toEqual('25px')
    })

    it('should has style by rootStyle props', () => {
      const node = TestUtils.renderIntoDocument(<Button rootStyle={{margin:30}} labelStyle={{padding: 21}} />)
      expect(node.refs.btn.getDOMNode().style.margin).toEqual('30px')
      expect(node.refs.lbl.getDOMNode().style.padding).toEqual('21px')
    })

    it('should has style by style props', () => {
      const node = TestUtils.renderIntoDocument(<Button rootStyle={{margin:30}} style={{margin: 40}}/>)
      expect(node.refs.btn.getDOMNode().style.margin).toEqual('40px')
      expect(node.refs.lbl.getDOMNode().style.padding).toEqual('15px')
    })
  })
})
