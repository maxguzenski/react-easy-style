# Stylium

Utility for making React components play nice with css.

**This project is still totally experimental, so feedback from component authors would be greatly appreciated!**

##Why?
The React community is highly fragmented when it comes to styling. Right now, there is more then 16 project for inline css on the github, all of they are trying to fix some "issue" that css has, like global scope... but they all are creating a lot of new one as well, and some are even worse.

After all there's two project that came with very cool ideas: 

1) react-css that looks like to be the only one that notice that style and react props/state are very tight one to another.  

2) Css-module, that without loose the power of css, fixed global scope issue.

This project try to put to gather reactccss and css-module into a simple and very small library.   


##How? 

Create you css/sass/less using :local from css-module:

```sass

:local .root {
  background-color: transparent;
  background-image: none;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-block;
  margin: 0px;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  white-space: nowrap;

  -webkit-appearance: none;
  user-select: none;

  //
  // browser state rules
  //
  &:focus,
  &:hover { text-decoration: none; }
  &:focus { outline: none; }

  //
  // React props/state rules
  //   final result: root--propsName-propsValue
  //   use sample: <Button disabled={true} size='lg' />
  //
  &--disabled-true {
    opacity: 0.65; box-shadow: none;
  }

  &--kind-default { /*...*/ }
  &--kind-primary { /*...*/ }
  &--kind-success { /*...*/ }

  &--size-lg { /*...*/ }
  &--size-sm { /*...*/ }
  &--size-xs { /*...*/ }
  
  

  &--circle-true {
    border-radius: 50%
  }
}
```

Now just implement your React component using Stylium decoration:

```javascript
import css from './button.scss'
import React from 'react'
import Stylium from '../stylium'

@Stylium( css )
export default class Button extends React.Component {
  static propTypes = {
    circle: React.PropTypes.bool,
    kind: React.PropTypes.string,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string,
  }

  static defaultProps = {
    size: 'sm', kind: 'primary'
  }

  onClick = (e) => {
    if (e) { e.preventDefault() }
    if (this.props.onClick) { this.props.onClick() }
  }

  render() {
    return <button onClick={this.onClick}>{ this.props.children }</button>
  }
}
```

And that is it!! Nothing more!

Output will be something like:

```jsx
// for <Button circle={true} kind='success' size='lg' />
// in the real world, css-module will change classname to something uniq like 'aseewfnjkc'
<button class='root root--kind-success root-size-lg root--circle-true'>...</button>
```


##Future?
Right now, I'm updating a medium size project using this concept, along the way I'll commit new features and ideas. But please, if you like, talk to me and help!  



