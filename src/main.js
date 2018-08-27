import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export function withMultipleContextsFactory(...rest) {
  const withContext = createMultipleContexts(...rest);

  return Component => {
    class ComponentWithMultipleContexts extends React.Component {
      constructor(...rest) {
        super(...rest);

        this._renderComponent = context => (
          <Component {...context} {...this.props} />
        );
      }

      render() {
        return withContext(this._renderComponent);
      }
    }

    hoistNonReactStatic(ComponentWithMultipleContexts, Component);

    return ComponentWithMultipleContexts;
  };
}

export function createNamedContext(name, { Consumer }) {
  return { name, Consumer };
}

export function createMultipleContexts(...rest) {
  let namedContexts = rest.reverse();

  return renderComponent => {
    let context = {};
    let callbackWithContext = () => renderComponent(context);

    let consumerTree = namedContexts.reduce(
      (componentTreeFactory, namedContext) =>
        generateConsumer(namedContext, context, componentTreeFactory),
      callbackWithContext
    )();

    return consumerTree;
  };
}

export function generateConsumer(namedContext, context, componentTreeFactory) {
  return function consumerFactory() {
    return (
      <namedContext.Consumer>
        {value => {
          context[namedContext.name] = value;

          return componentTreeFactory();
        }}
      </namedContext.Consumer>
    );
  };
}
