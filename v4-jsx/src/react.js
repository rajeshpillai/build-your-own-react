(() => {
  let rootDOMElement, rootReactElement;

  function anElement(element, props, children) {
    let reactElement;

    if (isClass(element)) {
      reactElement = new element(props);
      reactElement.children = children;
      reactElement.type = 'react';
      return reactElement;
    } else if (isStateLessComponent(element)) {
      return element(props);
    } else {
      return handleHtmlElement(element, props, children);
    }
  }

  function createElement(el, props, ...children) {
    return anElement(el, props, children);
  }

  function handleHtmlElement(element, props, children) {
    const anElement = document.createElement(element);
    children.forEach(child => appendChild(anElement, child));
    _.forEach(props, (value, name) => appendProp(anElement, name, value));
    return anElement;
  }

  function appendChild(element, child) {
    if (child.type === 'react') {
      appendChild(element, child.render());
    }
    if (typeof(child) === 'object') {
      element.appendChild(child);
    } else {
      element.innerHTML += child;
    }
  }

  function appendProp(element, propName, propVal) {
    if (shouldAddEventListener(propName)) {
      element.addEventListener(propName.substring(2), propVal);
    } else {
      if (propName === 'className') {
        propName = 'class';
      }
      element.setAttribute(propName, propVal);
    }
  }

  class Component {
    constructor(props) {
      this.props = props;
    }

    setState(state) {
      this.state = Object.assign({}, this.state, state);
      reRender();
    }
  }

  function reRender() {
    ReactDOM.render(rootReactElement, rootDOMElement);
  }

  window.React = {
    createElement,
    Component
  };
  window.ReactDOM = {
    render: (el, domEl) => {
      rootReactElement = el;
      rootDOMElement = domEl;
      while (rootDOMElement.hasChildNodes()) {
        rootDOMElement.removeChild(rootDOMElement.lastChild);
      }
      const currentDOM = rootReactElement.type === 'react' ? rootReactElement.render() : rootReactElement;
      rootDOMElement.appendChild(currentDOM);
    }
  };
})();