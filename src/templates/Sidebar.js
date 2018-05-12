/* @flow */

import * as React from 'react';
import { css, names } from 'linaria';
import Link from './Link';
import type { Metadata, Separator } from '../types';

const TEXT_COLOR = '#888';
const TEXT_HOVER_COLOR = '#111';

const sidebar = css`
  background-color: #fafafa;
  box-shadow: 0 0.5px 1.5px rgba(0, 0, 0, 0.32);

  @media (min-width: 640px) {
    height: 100%;
    min-width: 240px;
  }
`;

const navigation = css`
  padding: 24px;

  @media (min-width: 640px) {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const menu = css`
  display: none;
  position: relative;
  padding-top: 42px;

  @media (min-width: 640px) {
    display: block;
    height: 100%;
  }
`;

const menuIcon = css`
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: 640px) {
    display: none;
  }
`;

const menuButton = css`
  display: none;

  &:checked ~ .${menu} {
    display: block;
  }

  &:checked ~ label {
    color: #111;
    user-select: none;
  }
`;

const searchbar = css`
  position: absolute;
  top: 0;
  right: 0;
  appearance: none;
  width: 100%;
  padding: 16px 48px 16px 24px;
  font-size: 1em;
  background-color: white;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s;
  outline: 0;

  &:focus {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  @media (min-width: 640px) {
    padding: 12px 24px;
  }
`;

const separator = css`
  border: 0;
  background-color: rgba(0, 0, 0, 0.08);
  height: 1px;
  margin: 8px 0;
`;

const link = css`
  display: block;
  padding: 8px 0;
  text-decoration: none;
  color: ${TEXT_COLOR};

  &:hover {
    color: ${TEXT_HOVER_COLOR};
  }
`;

const active = css`
  color: #333;
  -webkit-text-stroke-color: currentColor;
  -webkit-text-stroke-width: 1px;
`;

const row = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .${link} {
    flex: 1;
  }
`;

const sectionItems = css`
  position: relative;
  padding-left: 15px;
  transition: 0.3s;

  &:before {
    content: '';
    display: block;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.08);
    width: 1px;
    top: 0;
    bottom: 0;
    left: 0;
    margin: 8px 0;
  }
`;

const sectionItemsVisible = css`
  opacity: 1;
`;

const sectionItemsHidden = css`
  opacity: 0;
`;

const buttonIcon = css`
  background-color: transparent;
  border: none;
  color: ${TEXT_COLOR};
  cursor: pointer;
  margin: 0;
  padding: 10px 12px;
  transition: 0.3s;

  &:hover {
    color: ${TEXT_HOVER_COLOR};
  }

  &:focus {
    outline: none;
  }
`;

const expandedIcon = css`
  transform: rotate(0deg);
`;

const collapsedIcon = css`
  transform: rotate(-180deg);
`;

type Props = {
  path: string,
  data: Array<Metadata | Separator>,
};

type State = {
  query: string,
  open: boolean,
  expanded: {
    [key: string]: { height: ?number, expanded: boolean },
  },
};

export default class Sidebar extends React.Component<Props, State> {
  state = {
    query: '',
    open: false,
    expanded: this.props.data.reduce((acc, item) => {
      if (item.type === 'separator') {
        return acc;
      }

      if (item.title.includes('.')) {
        const title = item.title.split('.')[0];
        const section = acc[title];

        if (!section) {
          acc[title] = {
            height: null,
            expanded: true,
          };
        }
      }

      return acc;
    }, {}),
  };

  componentDidMount() {
    this._measureHeights();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps !== this.props) {
      this._measureHeights();
    }
  }

  _measureHeights = () =>
    this.setState({
      expanded: this.props.data.reduce((acc, item) => {
        if (item.type === 'separator') {
          return acc;
        }

        if (item.title.includes('.')) {
          const title = item.title.split('.')[0];
          const section = acc[title];

          const height = this._items[title]
            ? this._items[title].clientHeight
            : null;

          if (!section) {
            acc[title] = {
              height,
              expanded: true,
            };
          }
        }

        return acc;
      }, {}),
    });

  _items: { [key: string]: ?HTMLDivElement } = {};

  render() {
    const { path, data } = this.props;
    const mapper = (item, i) => {
      if (item.type === 'separator') {
        return <hr key={`separator-${i + 1}`} className={separator} />;
      }

      if (item.type === 'section') {
        const sectionItem = this.state.expanded[item.title];

        return (
          <div key={item.path}>
            <div className={row}>
              <Link
                to={item.path}
                className={names(link, path === item.path && active)}
                onClick={() =>
                  this.setState(state => {
                    const group = state.expanded[item.title];

                    return {
                      expanded: {
                        ...state.expanded,
                        [item.title]: {
                          ...group,
                          expanded:
                            path === item.path
                              ? !group.expanded
                              : group.expanded,
                        },
                      },
                      open: false,
                      query: '',
                    };
                  })
                }
              >
                {item.title}
              </Link>
              <button
                className={names(
                  buttonIcon,
                  sectionItem && sectionItem.expanded
                    ? expandedIcon
                    : collapsedIcon
                )}
                style={{
                  opacity: typeof sectionItem.height === 'number' ? 1 : 0,
                }}
                onClick={() =>
                  this.setState(state => {
                    const group = state.expanded[item.title];

                    return {
                      expanded: {
                        ...state.expanded,
                        [item.title]: {
                          ...group,
                          expanded: !group.expanded,
                        },
                      },
                    };
                  })
                }
              >
                <svg width="16px" height="16px" viewBox="0 0 16 16">
                  <polygon
                    stroke="none"
                    strokeWidth="1"
                    fillRule="evenodd"
                    fill="currentColor"
                    points="8 4 2 10 3.4 11.4 8 6.8 12.6 11.4 14 10"
                  />
                </svg>
              </button>
            </div>
            <div
              ref={container => {
                this._items[item.title] = container;
              }}
              className={names(
                sectionItems,
                sectionItem.expanded ? sectionItemsVisible : sectionItemsHidden
              )}
              style={
                typeof sectionItem.height === 'number'
                  ? {
                      height: `${
                        sectionItem.expanded ? sectionItem.height : 0
                      }px`,
                    }
                  : null
              }
            >
              {item.items.map(mapper)}
            </div>
          </div>
        );
      }

      return (
        <Link
          key={item.path}
          to={item.path}
          className={names(link, path === item.path && active)}
          onClick={() => this.setState({ open: false, query: '' })}
        >
          {item.title}
        </Link>
      );
    };

    let items;

    if (this.state.query) {
      items = data.filter(item => {
        if (item.type === 'separator') {
          return false;
        }

        return item.title
          .toLowerCase()
          .includes(this.state.query.toLowerCase());
      });
    } else {
      const groups = data.reduce((acc, item) => {
        if (item.type === 'separator') {
          return acc;
        }

        if (item.title.includes('.')) {
          const title = item.title.split('.')[0];
          const section = acc[title];

          if (section) {
            section.items.push(item);
          } else {
            acc[title] = {
              type: 'section',
              title,
              items: [item],
            };
          }
        }

        return acc;
      }, {});

      items = data.reduce((acc, item) => {
        if (item.type === 'separator') {
          acc.push(item);
        } else {
          const title = item.title.split('.')[0];
          const section = groups[title];

          if (section) {
            const exists = acc.some(it => it.title && it.title === title);

            if (!exists) {
              if (title === item.title) {
                acc.push({ ...section, path: item.path });
              } else {
                acc.push(section);
              }
            }
          } else {
            acc.push(item);
          }
        }

        return acc;
      }, []);
    }

    const links = items.map(mapper);

    return (
      <aside className={sidebar}>
        <input
          className={menuButton}
          id="slide-sidebar"
          type="checkbox"
          role="button"
          checked={this.state.open}
          onChange={e => this.setState({ open: e.target.checked })}
        />
        <label className={menuIcon} htmlFor="slide-sidebar">
          ☰
        </label>
        <div className={menu}>
          <input
            type="search"
            value={this.state.query}
            onChange={e => this.setState({ query: e.target.value })}
            placeholder="Filter…"
            className={searchbar}
          />
          <nav className={navigation}>{links}</nav>
        </div>
      </aside>
    );
  }
}
