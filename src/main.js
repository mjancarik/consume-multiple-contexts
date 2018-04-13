import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export function withMultipleContext(...rest) {
  const multipleContexts = createMultipleContexts(...rest);

  return Component => {
    class MultipleContexts extends React.PureComponent {
      render() {
        return multipleContexts(context => (
          <Component {...context} {...this.props} />
        ));
      }
    }

    hoistNonReactStatic(MultipleContexts, Component);

    return MultipleContexts;
  };
}

export function createNamedContext({ Consumer }, name) {
  return { Consumer, name };
}

export function createMultipleContexts(...rest) {
  let namedContexts = rest.reverse();

  return renderProps => {
    let context = {};
    let callbackWithContext = () => renderProps(context);

    let consumerTree = namedContexts.reduce(
      (componentTreeFactory, namedContext) =>
        generateConsumer(namedContext, context, componentTreeFactory),
      callbackWithContext
    )();

    return consumerTree;
  };
}

function generateConsumer(namedContext, context, componentTreeFactory) {
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
