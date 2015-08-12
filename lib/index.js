'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = EasyStyle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

//
//
function isPlain(value) {
  var type = typeof value;
  return type === 'number' || type === 'string' || type === 'boolean';
}

//
//
function isClassNames(styleOrClass) {
  var firstKey = Object.keys(styleOrClass)[0];
  return typeof styleOrClass[firstKey] !== 'object';
}

//
//
function getDisplayName(Component) {
  return Component.displayName || Component.name;
}

//
//
function tranverse(node, level, getClasesAndStyles) {
  if (level === undefined) level = 0;

  if (!node || !node.props || !_react2['default'].isValidElement(node)) {
    return [false, node];
  }

  var children = node.props.children;

  var newChildren = null;
  var anyChildChanged = false;
  var rootChildAppear = false;

  if (children) {
    newChildren = _react2['default'].Children.map(children, function (child) {
      var tChild = tranverse(child, level + 1, getClasesAndStyles);
      anyChildChanged = anyChildChanged || tChild[1] !== child;
      rootChildAppear = rootChildAppear || tChild[0];
      return tChild[1];
    });
  }

  if (rootChildAppear) {
    return [true, _react2['default'].cloneElement(node, {}, newChildren)];
  }

  if (!level || node.props.is) {
    var isNodeRoot = !level || node.props.is === 'root';
    var _p = getClasesAndStyles(node, isNodeRoot);

    return [isNodeRoot, _react2['default'].cloneElement(node, _p, newChildren)];
  }

  if (anyChildChanged) {
    return [false, _react2['default'].cloneElement(node, {}, newChildren)];
  }

  return [false, node];
}

function EasyStyle(styleOrClass, _rootName) {
  var isClass = isClassNames(styleOrClass);

  return function (DecoredComponent) {
    var dispName = getDisplayName(DecoredComponent);

    var rootName = !isClass && 'root' || styleOrClass[_rootName] && _rootName || styleOrClass[dispName] && dispName || 'root';

    // if ((isClass && !styleOrClass[rootName]) || (!isClass && !styleOrClass['base']['root'])) {
    //   throw new Error(`Any rootName was found! searched by ${_rootName} / ${dispName} / root`)
    // }

    var getClassesAndStyles = function getClassesAndStyles(node, isRoot) {
      var is = node.props.is;
      var isName = isRoot ? rootName : is;
      var propsKlzz = [];

      var getStyleProp = function getStyleProp(k, v) {
        if (isClass) {
          return styleOrClass[v && isPlain(v) ? rootName + '--' + k + '-' + v : rootName + '--' + k + '-false'];
        } else {
          return styleOrClass[k + '-' + v] ? styleOrClass[k + '-' + v][isName] : null;
        }
      };

      if (isRoot || !isClass) {
        var allProps = _extends({}, this.state, this.props);

        for (var k in allProps) {
          var sp = getStyleProp(k, allProps[k]);
          sp && propsKlzz.push(sp);
        }
      }

      var className = (0, _classnames2['default'])(isClass ? styleOrClass[isName] : null, isClass ? propsKlzz : null, node.props.className, this.props[(isRoot ? 'root' : is) + 'Classes'], _defineProperty({}, this.props.className, isRoot && this.props.className));

      if (className.trim) className = className.trim();
      if (className === '') className = null;

      //
      // ok, let see styles now
      //

      var propsIfStyle = isClass ? {} : _extends({}, styleOrClass['base'] && styleOrClass['base'][isName], propsKlzz.reduce(function (m, i) {
        return _extends({}, m, i);
      }, {}));

      var style = _extends({}, propsIfStyle, node.props.style, this.props[(isRoot ? 'root' : is) + 'Style'], isRoot && this.props.style);

      return { className: className, style: style };
    };

    return (function (_DecoredComponent) {
      _inherits(Component, _DecoredComponent);

      function Component() {
        _classCallCheck(this, Component);

        _get(Object.getPrototypeOf(Component.prototype), 'constructor', this).apply(this, arguments);
      }

      _createClass(Component, [{
        key: 'render',
        value: function render() {
          var elem = _get(Object.getPrototypeOf(Component.prototype), 'render', this).call(this);
          return tranverse(elem, 0, getClassesAndStyles.bind(this))[1];
        }
      }]);

      return Component;
    })(DecoredComponent);
  };
}

module.exports = exports['default'];