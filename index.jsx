
import React from 'react'
import cx from 'classnames'
import _ from 'lodash'


function isPlain(v) {
  return _.isNumber(v) || _.isString(v) || _.isBoolean(v)
}

export default function createStylium(style, name='root') {

  const getRootState = (state={}, props={}) => {
    let klzzs = [style[name]]

    const allProps = {...state, ...props}

    for (let k in allProps) {
      const v = allProps[k]
      if (!v) { klzzs.push(style[`${name}--${k}-false`]) }
      if (v && isPlain(v)) { klzzs.push(style[`${name}--${k}-${v}`]) }
    }

    klzzs = _.compact(klzzs)
    return klzzs.length ? klzzs.join(' ') : ''
  }

  return DecoredComponent => class Component extends DecoredComponent {
    render() {
      const klzz = cx(getRootState(this.state, this.props), this.props.className)
      return (
        <div className={klzz}>{ super.render() }</div>
      )
    }
  }
}
