
import React from 'react'
import cx from 'classnames'


function isPlain(value) {
  const type = typeof value
  return type === 'number' || type === 'string' || type === 'boolean'
}

function isClassNames(styleOrClass) {
  const firstKey = Object.keys(styleOrClass)[0]
  return typeof styleOrClass[firstKey] !== 'object'
}


export default function EasyStyle(styleOrClass, rootName='root') {
  const isClass = isClassNames(styleOrClass)

  const tranverse = function(node, level=0, getClasesAndStyles) {
    if (!node || !node.props || !React.isValidElement(node)) {
      return [false, node]
    }

    const { children } = node.props

    let newChildren = null
    let anyChildChanged = false
    let rootChildAppear = false

    if (children) {
      newChildren = React.Children.map(children, child => {
        const tChild = tranverse(child, level + 1, getClasesAndStyles)
        anyChildChanged = anyChildChanged || tChild[1] !== child
        rootChildAppear = rootChildAppear || tChild[0]
        return tChild[1]
      })
    }

    if (rootChildAppear) {
      return [
        true,
        React.cloneElement(node, {}, newChildren)
      ]
    }

    if (!level || node.props.is) {
      const isNodeRoot = !level || node.props.is === 'root'
      const _p = getClasesAndStyles(node, isNodeRoot)

      return [
        isNodeRoot,
        React.cloneElement(node, _p, newChildren)
      ]
    }

    if (anyChildChanged) {
      return [
        false,
        React.cloneElement(node, {}, newChildren)
      ]
    }

    return [ false, node ]
  }


  const defaultGetClassesAndStyles = function(node, isRoot) {
    const is = node.props.is
    const isName = isRoot ? rootName : is
    const propsKlzz = []

    const getStyleProp = (k, v) => {
      if (isClass) {
        return styleOrClass[v && isPlain(v) ? `${rootName}--${k}-${v}` : `${rootName}--${k}-false`]
      } else {
        return styleOrClass[`${k}-${v}`] ? styleOrClass[`${k}-${v}`][isName] : null
      }
    }

    if (isRoot || !isClass) {
      const allProps = {...this.state, ...this.props}

      for (let k in allProps) {
        const v = allProps[k]
        propsKlzz.push(getStyleProp(k,v))
      }
    }

    const className = cx(
      isClass ? styleOrClass[isName] : null,
      isClass ? propsKlzz : null,
      node.props.className,
      this.props[(isRoot ? 'root' : is)+'Classes'],
      {[this.props.className]: isRoot && this.props.className}
    )

    //
    // ok, let see style now
    //

    const mergePropsKlzz = () => {
      return propsKlzz.reduce( (memo, item) => {
        memo = {...memo, ...item}
        return memo
      }, {})
    }

    const propsIfStyle = isClass ? {} : {
      ...( styleOrClass['base'] && styleOrClass['base'][isName] ),
      ...( mergePropsKlzz() )
    }

    const style = {
      ...propsIfStyle,
      ...( node.props.style ),
      ...( this.props[(isRoot ? 'root' : is)+'Style'] ),
      ...( isRoot && this.props.style )
    }

    return { className, style }
  }


  return DecoredComponent => class Component extends DecoredComponent {
    render() {
      const elem = super.render()
      return tranverse(elem, 0, defaultGetClassesAndStyles.bind(this))[1]
    }
  }
}
