# consume-multiple-contexts

[![Build Status](https://travis-ci.org/mjancarik/consume-multiple-contexts.svg?branch=master)](https://travis-ci.org/mjancarik/consume-multiple-contexts) [![dependencies Status](https://david-dm.org/mjancarik/consume-multiple-contexts/status.svg)](https://david-dm.org/mjancarik/consume-multiple-contexts)
[![Coverage Status](https://coveralls.io/repos/github/mjancarik/consume-multiple-contexts/badge.svg?branch=master)](https://coveralls.io/github/mjancarik/consume-multiple-contexts?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Utility for consuming multiple react contexts.

## Why?
It's common to have multiple contexts in React ecosystems and you need consuming them together in your components. In new context API is way for that but you must repeat consumers for every component. It's maybe good for few component but for large applications is pain. The module consume-multiple-contexts try to solve that.

## Installation

You can add the consume-multiple-contexts to your project using npm:

```
npm i consume-multiple-contexts --save
```

## Usage

I use example from React [documentation](https://reactjs.org/docs/context.html).

```javascript
const ThemeContext = React.createContext('light');
const UserContext = React.createContext();

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

function Sidebar() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfileSidebar user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

```

If you use consume-multiple-contexts module you can write:

```javascript
import { createNamedContext, createMultipleContexts } from 'consume-multiple-contexts';

const ThemeContext = React.createContext('light');
const UserContext = React.createContext();

const renderWithContext = createMultipleContexts(
    createNamedContext(ThemeContext, 'theme'),
    createNamedContext(UserContext, 'user')
);

.
.

function Content() {
  return renderWithContext(({ theme, user }) => (
    <ProfilePage theme={theme} user={user} />
  ));
}

function Sidebar() {
  return renderWithContext(({ theme, user }) => (
    <ProfileSidebar theme={theme} user={user} />
  ));
}

```
Or if you like HOC you can write:

```javascript
import { createNamedContext, withMultipleContext } from 'consume-multiple-contexts';

const ThemeContext = React.createContext('light');
const UserContext = React.createContext();

const multipleContexts = [
  createNamedContext(ThemeContext, 'theme'),
  createNamedContext(UserContext, 'user')
];

.
.

const Content = withMultipleContext(...multipleContexts)(ProfilePage);
const Sidebar = withMultipleContext(...multipleContexts)(ProfileSidebar);

```
