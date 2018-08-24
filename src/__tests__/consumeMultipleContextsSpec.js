import React from 'react';
import { mount } from 'enzyme';
import {
  createMultipleContexts,
  createNamedContext,
  withMultipleContext
} from '../main';

const ThemeContext = React.createContext('light');
const UserContext = React.createContext({ name: 'profile' });

class Profile extends React.Component {
  render() {
    return (
      <div>
        {this.props.theme}, {this.props.user && this.props.user.name}
      </div>
    );
  }
}

class Other extends React.Component {
  render() {
    return (
      <span>
        {this.props.theme}, {this.props.user && this.props.user.name}
      </span>
    );
  }
}

class App extends React.Component {
  render() {
    const { user, theme, Component } = this.props;

    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={user}>
          <Component />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

describe('consume-multiple-contexts', () => {
  describe('createNamedContext method', () => {
    it('should return right structure', () => {
      expect(createNamedContext('theme', ThemeContext)).toMatchSnapshot();
    });
  });

  describe('createMultipleContexts method', () => {
    let multipleContexts = null;

    beforeAll(() => {
      multipleContexts = createMultipleContexts(
        createNamedContext('theme', ThemeContext),
        createNamedContext('user', UserContext)
      );
    });

    it('should create multiple contexts factory', () => {
      function Web() {
        return multipleContexts(({ theme, user }) => (
          <Profile theme={theme} user={user} />
        ));
      }

      const wrapper = mount(<App theme="dark" Component={Web} />);

      expect(wrapper).toMatchSnapshot();
      wrapper.setProps({ theme: 'red', user: { name: 'anonymous' } });
      expect(wrapper).toMatchSnapshot();
    });

    it('should create multiple contexts factory 2', () => {
      function Web() {
        return multipleContexts(({ theme, user }) => (
          <Other theme={theme} user={user} />
        ));
      }

      expect(mount(<Web />)).toMatchSnapshot();
    });
  });

  describe('withMultipleContext HOC', () => {
    it('should pass context to props', () => {
      const Component = withMultipleContext(
        createNamedContext('theme', ThemeContext),
        createNamedContext('user', UserContext)
      )(Profile);

      const wrapper = mount(
        <App theme="dark" user={{ name: 'anonymous' }} Component={Component} />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
