# react-easy-style

A tiny library to easy apply css/styles to react components.

**This project very young, so feedback from component authors would be greatly appreciated!**

## Install

`npm install react-easy-style`

## Why?
The React community is highly fragmented when it comes to styling. Right now, there is more then 16 project for inline css on the github, all of they are trying to fix some "issue" that css has, like global scope... but, I think, they all are creating a lot of new one as well.

1. [react-css](http://reactcss.com/): seems to be the only one to have noticed that style and react props/state are strong linked to each other.

2. [webpack css-loader](https://github.com/webpack/css-loader): with support to [CSS Module spec](https://github.com/css-modules/css-modules) has fixed css global scope issue.

This project "borrow" ideas from react-css and join with webpack css-loader to make a very light and useful library to easy use classes and styles on react components.


## How?

Take a look!

```javascript
// button.jsx

import React from 'react'
import EasyStyle from 'react-easy-style'

// import css/scss/less using webpack css-loader
import css from './button.scss'

@EasyStyle( css )
export default class Button extends React.Component {
  static defaultProps = {
    kind: 'primary'
  }

  render() {
    return <button>{ this.props.label }</button>
  }
}

// if you don't use decorators:
//   class Button extends React.component { ... }
//   export default EasyStyle(css)(Button)
```
```sass
// button.scss

:local .root {
  border: 1px solid transparent;
  // a lot of other styles

  // browser state rules
  &:focus { outline: none; }

  // React props/state rules
  //   pattern: className--propsName-propsValue
  //
  &--disabled-true { opacity: 0.65; box-shadow: none; }
  &--circle-true { border-radius: 50% }

  &--kind-default { /*...*/ }
  &--kind-primary { /*...*/ }
  &--kind-success { /*...*/ }
}
```
And finally, how to call it and its output:
```javascript
// when you call
<Button kind='primary' circle={true} label='...'/>

// ... you'll receive this final html
<button class='root root--kind-success root--circle-true'>...</button>

// ps.: On real world, css-modules will change classes names
//  to make they unique (no more global namespace!), something like:
<button class='jduei3dfu3d_Kjm jduei3dfu3d_Kjm-2e jduei3dfu3d_Kjm-43'>...</button>

```

And that is it. seriously!

For small/medium components you will end up with 0 (zero) css references on you code. For more complex components, please keep reading ;-)


## Other examples

##### When you need pass internal and external classNames...
```javascript
class Button extends React.Component {
  render() {
    return (
      <button className='in1 in2'>{this.props.label}</button>
    )
  }
}

// call
<Button kind='primary' className='out1 ou2' label='...'/>

// html output
<button class='root root--kind-primary in1 in2 out1 out2'>...</button>
```

##### You can make references to a nested class (use 'is')
```javascript
class Button extends React.Component {
  render() {
    return (
      <button>
        <span is='label'>{this.props.label}</span>
        <span is='desc'>{this.props.desc}</span>
      </button>
    )
  }
}

// call
<Button kind='primary' label='...' desc='...' />

// html output
//  don't forget, with css-modules, label and desc class names will receive unique names
//  so... using a generic name like 'label' isn't a issue
<button class='root root--kind-primary'>
  <span class='label'>...</span>
  <span class='desc'>...</span>
</button>

```
```scss
// button.scss

:local .root {
  .label { color: #000 }
  .desc  { font-size: 85% }
  // a lot of other styles
}

```

##### Your nested elements will be merged with other classes as expected
```javascript
class Button extends React.Component {
  render() {
    return (
      <button>
        <span is='label'>{this.props.label}</span>
        <span is='desc' className='in1 in2'>{this.props.desc}</span>
      </button>
    )
  }
}

// call
<Button kind='primary' label='...' desc='...' />

// html output
<button class='root root--kind-primary'>
  <span class='label'>...</span>
  <span class='desc in1 in2'>...</span>
</button>
```


##### Your root and nested elements can receive classes and styles (themable!)
```javascript
class Button extends React.Component {
  render() {
    return (
      <button>
        <span is='label' style={{fontSize: 15}}>{this.props.label}</span>
        <span is='desc'>{this.props.desc}</span>
      </button>
    )
  }
}

// call
// ps.: for root you can use className/style or rootClasses/rootStyle or both ;)
// all styles will be merged
<Button
  labelClasses='lb1 lb2'
  labelStyle={{marginLeft: 10}}
  rootClasses='rt1'
  style={{padding: 2}}
  kind='primary' label='...' desc='...' />

// html output
<button class='root root--kind-primary rt1' style='padding: 2px'>
  <span class='label lb1 lb2' style='font-size: 15px; margin-left: 10px'>...</span>
  <span class='desc'>...</span>
</button>
```

##### If your top-level element is not your root element, use is='root'
```javascript
class Button extends React.Component {
  render() {
    return (
      <ToolTip<button is='root'>...</button></ToolTip>
    )
  }
}

// call
<Button kind='primary' label='...' />

//output
<div class='from-tooltip'>
  <button class='root root--kind-primary'>...</button>
</div>
```

##### If you want/have to change top-level class name
```javascript
// grid.jsx

@EasyStyle( css, 'container')
class Container extends React.Component {}

@EasyStyle( css, 'row')
class Row extends React.Component {}

@EasyStyle( css, 'col')
class Col extends React.Component {}
```
```scss
// grid.scss
:local .container { /** ... **/ }
:local .row { /** ... **/ }
:local .col { /** ... **/ }
```


## All this is pretty cool... but I want to use inline styles.

Ok, react-easy-style has support to inline-styles BUT without advanced feature like browser state/media queries.

How to use it:

```javascript

const style = {
  base: {
    root: { padding: 2, /**...**/ },
    label: { /**...**/ },
    desc: { /**...**/ }
  },
  'kind-primary': {
    root: { /**...**/ },
    label: { /**...**/ },
    desc: { /**...**/ }
  },
  'circle-true': {
    root: { /**...**/ },
    label: { /**...**/ },
    desc: { /**...**/ }
  }
}

@EasyStyle( style )
export default class Button extends React.Component {
  static defaultProps = {
    kind: 'primary'
  }

  render() {
    return (
      <button>
        <span is='label'>{this.props.label}</span>
        <span is='desc'>{this.props.desc}</span>
      </button>
    )
  }
}

// and its works.
// and yet, you can use rootClasses, rootStyle, labelStyle, labelClasses, etc
```

## What next?
* Implement tests ;)
* Performance

## Finally

**If you like it, please help!!**
