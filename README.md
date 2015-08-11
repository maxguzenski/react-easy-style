# React Easy Style

A tiny library to easy apply css/styles to react components.

**This project very young, so feedback from component authors would be greatly appreciated!**

## Install

`npm install react-easy-style`

you'll need also:
`webpack`, `css-loader`, `react`

## Why?
The React community is highly fragmented when it comes to styling. Right now, there is more then 16 project for inline css on the github, all of they are trying to fix some "issue" that css has, like global scope... but, I think, they all are creating a lot of new one as well.

**React Easy Style** "borrow" ideas from one of those projects: react-css (1). And join it with webpack css-loader (2) to make a very light and useful library to easy use classes and styles on react components.

1. [react-css](http://reactcss.com/): seems to be the only one to have noticed that style and react props/state are strong linked to each other.

2. [webpack css-loader](https://github.com/webpack/css-loader): with support to [CSS Module spec](https://github.com/css-modules/css-modules) that fix css global scope issue.


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

:local .Button {
  border: 1px solid transparent;
  // a lot of other styles

  // browser state rules
  &:focus { outline: none; }

  // React props/state rules
  //   pattern: className--propsKey-propsValue
  //
  &--disabled-true { opacity: 0.65; box-shadow: none; }
  &--circle-true { border-radius: 50% }

  &--kind-default { /*...*/ }
  &--kind-primary { /*...*/ }
  &--kind-success { /*...*/ }
}
```
And that is it. seriously!! <br/>
For small/medium components you will end up with 0 (zero) css references on you code.

Here a example of how to call it and its output:

```javascript
// when you call
<Button kind='primary' circle={true} label='...'/>

// ... you'll receive this final html
<button class='Button Button--kind-primary Button--circle-true'>...</button>

// ps.: On real world, css-modules will change classes names
//  to make they unique (no more global namespace!), something like:
<button class='jduei3dfu3d_Kjm jduei3dfu3d_Kjm-2e jduei3dfu3d_Kjm-43'>...</button>

```
 For more complex components, please, keep reading ;-)


## Other examples

#### When you need pass internal and external classNames...
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
<button class='Button Button--kind-primary in1 in2 out1 out2'>...</button>
```

#### You can make references to a nested class (using 'is' attribute)
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
<button class='Button Button--kind-primary'>
  <span class='label'>...</span>
  <span class='desc'>...</span>
</button>

```
```scss
// button.scss

:local .Button {
  .label { color: #000 }
  .desc  { font-size: 85% }
  // a lot of other styles
}

```

#### Classes and styles defined on nested element will be merged as well
```javascript
class Button extends React.Component {
  render() {
    return (
      <button>
        <span is='label'>{this.props.label}</span>
        <span is='desc' className='in1 in2' style={{fontSize:12}}>{this.props.desc}</span>
      </button>
    )
  }
}

// call
<Button kind='primary' label='...' desc='...' />

// html output
<button class='Button Button--kind-primary'>
  <span class='label'>...</span>
  <span class='desc in1 in2' style='font-size: 12px'>...</span>
</button>
```


#### Your root and nested elements can receive classes and styles from outside

To nested elements that use, for example, is='label' you'll have labelClasses='class1' and labelStyle={{...}}.
for top-level element (root) you have rootClasses, rootStyles, className and style.
In another word: Themeable for free.

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
// ps.: for root you can use className/style or rootClasses/rootStyle or both ;)
// all styles will be merged
<Button
  labelClasses='lb1 lb2'
  labelStyle={{marginLeft: 10}}
  rootClasses='rt1'
  className='cn1'
  style={{padding: 2}}
  kind='primary' label='...' desc='...' />

// html output
<button class='Button Button--kind-primary rt1 cn1' style='padding: 2px'>
  <span class='label lb1 lb2' style='margin-left: 10px'>...</span>
  <span class='desc'>...</span>
</button>
```

#### If your top-level element is not your root element, use is='root'
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
  <button class='Button Button--kind-primary'>...</button>
</div>
```

#### If you want/have to change top-level class name

By default Easy Style will try to find a class with same name of component, or one called 'root'.
But you can pass a new name as well.

```javascript
// grid.jsx
@EasyStyle(css, 'myContainer')
class Container extends React.Component {}
```
```scss
// grid.scss
// acceptable top-level class names are:

:local .myContainer { /** ... **/ }
:local .Container { /** ... **/ }
:local .root { /** ... **/ }
```


## All this is pretty cool... but I want to use inline styles.

Ok, React Easy Style has support to inline styles BUT without fancy feature like browser state and media queries.

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
* Review performance (it already is very fast, but can it be more?)
* Support themes, may by using react context

## Finally

**If you like it, please help!!**
