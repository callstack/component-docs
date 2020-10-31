import * as React from 'react';
import { styled } from 'linaria/react';
import type { Metadata, Separator, Page, Group, GroupItem } from '../types';
import Link from './Link';

const SidebarContent = styled.aside`
  background-color: #f8f9fa;
  background-color: var(--theme-secondary-bg);

  @media (min-width: 640px) {
    height: 100%;
    min-width: 240px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const Navigation = styled.nav`
  padding: 12px 24px;

  @media (min-width: 640px) {
    padding: 20px 32px;
  }
`;

const Searchbar = styled.input`
  appearance: none;
  width: calc(100% - 48px);
  padding: 8px 12px;
  margin: 32px 24px 0;
  font-size: 1em;
  background-color: rgba(0, 0, 55, 0.08);
  transition: background-color 0.3s;
  border-radius: 3px;
  border: 0;
  outline: 0;
  color: #000;
  color: var(--theme-text-color);

  &:focus {
    background-color: rgba(0, 0, 55, 0.12);
  }

  .dark-theme & {
    background-color: rgba(255, 255, 200, 0.08);
  }

  .dark-theme &:focus {
    background-color: rgba(255, 255, 200, 0.08);
  }

  @media (min-width: 640px) {
    width: calc(100% - 64px);
    margin: 32px 32px 0;
  }
`;

const MenuContent = styled.div`
  position: fixed;
  opacity: 0;
  pointer-events: none;

  @media (min-width: 640px) {
    position: relative;
    opacity: 1;
    pointer-events: auto;
  }

  @media (max-width: 639px) {
    ${Searchbar}:first-child {
      margin-top: 72px;
    }
  }
`;

const MenuIcon = styled.label`
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 16px;
  margin: 16px;
  background-color: #f8f9fa;
  background-color: var(--theme-secondary-bg);
  border-radius: 3px;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: 640px) {
    display: none;
  }
`;

const MenuButton = styled.input`
  display: none;

  &:checked ~ ${MenuContent} {
    position: relative;
    opacity: 1;
    pointer-events: auto;
  }

  &:checked ~ label {
    color: #111;
    user-select: none;
  }
`;

const SeparatorItem = styled.hr`
  border: 0;
  background-color: rgba(0, 0, 0, 0.04);
  height: 1px;
  margin: 20px 0;
`;

// @ts-ignore: FIXME
const LinkItem = styled(Link)`
  display: block;
  padding: 12px 0;
  text-decoration: none;
  color: #888;
  line-height: 1;

  &:hover {
    color: #111;
    color: var(--theme-primary-color);
    text-decoration: none;
  }

  &[data-selected='true'] {
    color: #333;
    color: var(--theme-primary-color);

    &:hover {
      color: #333;
      color: var(--theme-primary-color);
    }
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${LinkItem} {
    flex: 1;
  }
`;

const GroupItems = styled.div`
  position: relative;
  padding-left: 12px;
  transition: 0.3s;

  &:before {
    content: '';
    display: block;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.04);
    width: 1px;
    top: 0;
    bottom: 0;
    left: 0;
    margin: 12px 0;
  }

  &[data-visible='true'] {
    opacity: 1;
  }

  &[data-visible='false'] {
    opacity: 0;
    pointer-events: none;
  }
`;

const ButtonIcon = styled.button`
  background-color: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  margin: 0;
  padding: 10px 12px;
  transition: 0.3s;
  opacity: 0.8;

  &:hover {
    color: #555;
  }

  &:focus {
    outline: none;
  }

  &[data-expanded='true'] {
    transform: rotate(0deg);
  }

  &[data-expanded='false'] {
    transform: rotate(-180deg);
  }
`;

type Props = {
  path: string;
  data: Array<Metadata | Separator>;
};

type Expanded = Record<
  string,
  { height: number | undefined; expanded: boolean }
>;

type State = {
  query: string;
  open: boolean;
  expanded: Expanded;
};

export default class Sidebar extends React.Component<Props, State> {
  state = {
    query: '',
    open: false,
    expanded: this.props.data.reduce<Expanded>((acc, item) => {
      if (item.type === 'separator') {
        return acc;
      }

      if (item.group) {
        const group = acc[item.group];

        if (!group) {
          acc[item.group] = {
            height: undefined,
            expanded: true,
          };
        }
      }

      return acc;
    }, {}),
    mode: 'light',
  };

  componentDidMount() {
    setTimeout(() => this.measureHeights(), 1000);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data !== this.props.data) {
      this.measureHeights();
    }
  }

  private measureHeights = () => {
    this.setState({
      expanded: this.props.data.reduce<Expanded>((acc, item) => {
        if (item.type === 'separator') {
          return acc;
        }

        if (item.group) {
          const group = acc[item.group];

          const height = this.items[item.group]
            ? this.items[item.group]?.clientHeight
            : undefined;

          if (!group) {
            acc[item.group] = {
              height,
              expanded: true,
            };
          }
        }

        return acc;
      }, {}),
    });
  };

  private items: Record<string, HTMLDivElement | null> = {};

  render() {
    const { path, data } = this.props;
    const mapper = (item: Separator | Group | GroupItem, i: number) => {
      if (item.type === 'separator') {
        return <SeparatorItem key={`separator-${i + 1}`} />;
      }

      if (item.type === 'group') {
        const groupItem = this.state.expanded[item.title] || {
          height: null,
          expanded: true,
        };

        return (
          <div key={item.link || item.title + i}>
            <Row>
              <LinkItem
                data-selected={path === item.link}
                to={item.link}
                onClick={() =>
                  this.setState((state) => {
                    const group = state.expanded[item.title];

                    return {
                      expanded: {
                        ...state.expanded,
                        [item.title]: {
                          ...group,
                          expanded:
                            path === item.link || !item.link
                              ? !group.expanded
                              : group.expanded,
                        },
                      },
                      open: path === item.link ? state.open : false,
                      query: '',
                    };
                  })
                }
              >
                {item.title}
              </LinkItem>
              <ButtonIcon
                data-expanded={groupItem.expanded}
                style={{
                  opacity: typeof groupItem.height === 'number' ? 1 : 0,
                }}
                onClick={() =>
                  this.setState((state) => {
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
              </ButtonIcon>
            </Row>
            <GroupItems
              ref={(container) => {
                this.items[item.title] = container;
              }}
              data-visible={!!groupItem.expanded}
              style={
                typeof groupItem.height === 'number'
                  ? {
                      height: `${groupItem.expanded ? groupItem.height : 0}px`,
                    }
                  : {}
              }
            >
              {item.items.map(mapper)}
            </GroupItems>
          </div>
        );
      }

      return (
        <LinkItem
          data-selected={path === item.link}
          key={item.link}
          to={item.link}
          onClick={() => this.setState({ open: false, query: '' })}
        >
          {item.title}
        </LinkItem>
      );
    };

    let items;

    if (this.state.query) {
      items = data.filter((item) => {
        if (item.type === 'separator') {
          return false;
        }

        return item.title
          .toLowerCase()
          .includes(this.state.query.toLowerCase());
      });
    } else {
      // Find all groups names in our data and create a list of groups
      const groups = ((data.filter((item) =>
        // @ts-ignore
        Boolean(item.group)
      ) as any) as (Page & { group: string })[])
        .map((item): string => item.group)
        .filter((item, i, self) => self.lastIndexOf(item) === i)
        .reduce<
          Record<
            string,
            {
              type: 'group';
              items: GroupItem[];
              title: string;
            }
          >
        >(
          (acc, title: string) =>
            Object.assign(acc, {
              [title]: {
                type: 'group',
                items: [],
                title,
              },
            }),
          {}
        );

      // Find items belonging to groups and add them to the groups
      items = data.reduce<(Separator | Group | GroupItem)[]>((acc, item) => {
        if (item.type === 'separator') {
          acc.push(item);
        } else if (item.title in groups) {
          // If the title of the item matches a group, replace the item with the group
          const group = groups[item.title];

          acc.push({ ...group, link: item.link });
        } else if (item.group) {
          // If the item belongs to a group, find an item matching the group first

          const index = acc.findIndex(
            (it) => it.type !== 'separator' && it.title === item.group
          );

          let group = acc[index];

          if (group) {
            if (group.type !== 'group') {
              // If the item exists, but is not a group, turn it a to a group first

              group = { ...groups[item.group], link: item.link };

              acc[index] = group;
            } else {
              // If the group exists, add our item
              group.items.push(item);
            }
          } else {
            // If the item doesn't exist at all, add a new group to the list

            group = groups[item.group];

            group.items.push(item);
            acc.push(group);
          }
        } else {
          acc.push(item);
        }

        return acc;
      }, []);
    }

    const links = items.map(mapper);

    return (
      <SidebarContent>
        <MenuButton
          id="slide-sidebar"
          type="checkbox"
          role="button"
          checked={this.state.open}
          onChange={(e) => this.setState({ open: e.target.checked })}
        />
        <MenuIcon htmlFor="slide-sidebar">☰</MenuIcon>
        <MenuContent>
          <Searchbar
            type="search"
            value={this.state.query}
            onChange={(e) => this.setState({ query: e.target.value })}
            placeholder="Filter…"
          />
          <Navigation>{links}</Navigation>
        </MenuContent>
      </SidebarContent>
    );
  }
}
