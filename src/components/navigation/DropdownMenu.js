import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';

export default class DropdownMenu extends React.Component {
  static propTypes = {
    link: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    timeout: PropTypes.number,
    isMobile: PropTypes.bool.isRequired,
    className: PropTypes.string
  };

  state = {
    isActive: false,
    toggleStarted: null
  };

  timeout = null;

  render() {
    let { children, link, name, timeout, className } = this.props;
    console.log('state', this.state);
    children = this.addSubmenuClassesToChildren(children);
    if (!timeout) {
      timeout = 500;
    }
    let classNames = ['is-dropdown-submenu-parent', 'opens-right'];

    if (className) {
      classNames = classNames.concat(className.split(' '));
    }
    return (
      <li
        className={classNames.join(' ')}
        role="menuitem"
        aria-haspopup="true"
        aria-label={name}
        onMouseEnter={() => this.toggleSubmenu(true)}
        onMouseLeave={() => this.toggleSubmenu(false, timeout)}
      >
        <Link to={link} onClick={this.handleMobileClicks}>
          {name}
        </Link>
        {children}
      </li>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  toggleSubmenu = (isActive, timeout = 0) => {
    let toggleStarted = Date.now();
    this.setState({ toggleStarted });
    //-- Reset timeout for Mobile as mobile does not have an effective MouseOut
    if (this.props.isMobile) {
      timeout = 0;
    }
    this.timeout = setTimeout(() => {
      if (this.state.toggleStarted !== toggleStarted) {
        return;
      }
      this.setState({ isActive });
    }, timeout);
  };

  addSubmenuClassesToChildren(children) {
    return React.Children.map(children, (child) => {
      let childClassNames = child.props.className.split(' ');
      let className = [
        'menu',
        'submenu',
        'is-dropdown-submenu',
        'first-sub',
        'vertical'
      ];
      if (this.state.isActive) {
        className.push('js-dropdown-active');
      }
      className = className
        .filter((item) => {
          return childClassNames.indexOf(item) === -1;
        })
        .concat(childClassNames)
        .join(' ');

      return React.cloneElement(child, {
        role: 'menubar',
        className
      });
    });
  }

  handleMobileClicks = (event) => {
    if (this.props.isMobile) {
      event.preventDefault();
      if (!this.state.isActive) {
        this.toggleSubmenu(true);
        return;
      }
      if (this.state.isActive) {
        this.toggleSubmenu(false);
        return;
      }
    }
  };
}