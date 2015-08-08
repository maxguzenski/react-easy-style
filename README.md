# Stylium

Utility for making React components play nice with css.

**This project is still totally experimental, so feedback from component authors would be greatly appreciated!**

##Why?
The React community is highly fragmented when it comes to styling. Right now, there is more then 16 project for inline css on the github, all of they are trying to fix some "issue" that css has, like global scope... but they all are creating a lot of new one as well, and some are even worse.

After all there's two project that came with very cool ideas: 

1) [ReactCSS](http://reactcss.com/) that looks like to be the only one that notice that style and react props/state are very tight one to another.  

2) [css-modules](https://github.com/css-modules/css-modules), that without loose the power of css, fixed global scope issue.

This project try to put to gather reactccss and css-modules into a simple and very small library.   


##How? 

Create your css/sass/less normally, using :local from css-modules:

```sass
:local .root {
  border: 1px solid transparent;
  // a lot of other styles

  // browser state rules
  &:focus,
  &:hover { text-decoration: none; }
  &:focus { outline: none; }

  // React props/state rules
  //   final result: root--propsName-propsValue
  //   use sample: <Button disabled={true} size='lg' circle={true} />
  //
  &--disabled-true { opacity: 0.65; box-shadow: none; }
  &--circle-true { border-radius: 50% }
  
  &--kind-default { /*...*/ }
  &--kind-primary { /*...*/ }
  &--kind-success { /*...*/ }

  &--size-lg { /*...*/ }
  &--size-sm { /*...*/ }
  &--size-xs { /*...*/ }
}
```

Now just implement your React component using Stylium decoration:

```javascript
import css from './button.scss'
import React from 'react'
import Stylium from '../stylium'

@Stylium( css )
export default class Button extends React.Component {
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

And that is it!! seriously! 

For small components you will have zero classname references, for medium/large ones you can combine stylium  and regular className={css.elemenClass}

Output will be something like:

```jsx
// for <Button circle={true} kind='success' size='lg' />
// in the real world, css-module will change classname to something uniq like 'aseewfnjkc'
<button class='root root--kind-success root-size-lg root--circle-true'>...</button>
```


##Future?
Right now, I'm updating a medium size project using this concept, along the way I'll commit new features and ideas. Maybe Stylium could does something like this:

```javascript
// ref your nested components with react.refs
<div ref='root'>
  <div ref='nested1'/>
  <div ref='nested2'/>
</div>

// Then you can let other calls your component like that:
<Component rootClass='home withicons' rootStyles={padding: 2} nested1Style={color: '#ccc'} />

//
// and stylium garantee that all class (from css or from properties) and styles goes to correct elements.
//
```

**Please, if you like, talk to me and help!**

ps.: I know, project name sucks! But I think that all cool names was taken...maybe I'll change it to 'react-got-style', I don't know...



