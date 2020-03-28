/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';

type Props = {
  type: 'dark' | 'light',
};

const ThemeIcon = ({ type = 'dark' }: Props) => {
  if (type === 'dark') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="20"
        viewBox="0 0 50 50"
      >
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M37,4a22,22 0 1,0 0,42a22,22 0 0,1 0-42z"
        />
      </svg>
    );
  } else if (type === 'light') {
    return (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="22"
        fill={'orange'}
        viewBox="0 0 130 130"
        enableBackground="new 0 0 129 129"
      >
        <g>
          <g>
            <path d="m64.5,92.6c15.5,0 28-12.6 28-28s-12.6-28-28-28-28,12.6-28,28 12.5,28 28,28zm0-47.9c11,0 19.9,8.9 19.9,19.9 0,11-8.9,19.9-19.9,19.9s-19.9-8.9-19.9-19.9c0-11 8.9-19.9 19.9-19.9z" />
            <path d="m68.6,23.6v-12.9c0-2.3-1.8-4.1-4.1-4.1s-4.1,1.8-4.1,4.1v12.9c0,2.3 1.8,4.1 4.1,4.1s4.1-1.8 4.1-4.1z" />
            <path d="m60.4,105.6v12.9c0,2.3 1.8,4.1 4.1,4.1s4.1-1.8 4.1-4.1v-12.9c0-2.3-1.8-4.1-4.1-4.1s-4.1,1.8-4.1,4.1z" />
            <path d="m96.4,38.5l9.1-9.1c1.6-1.6 1.6-4.2 0-5.8-1.6-1.6-4.2-1.6-5.8,0l-9.1,9.1c-1.6,1.6-1.6,4.2 0,5.8 0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2z" />
            <path d="m23.5,105.6c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l9.1-9.1c1.6-1.6 1.6-4.2 0-5.8-1.6-1.6-4.2-1.6-5.8,0l-9.1,9.1c-1.6,1.6-1.6,4.2 0,5.8z" />
            <path d="m122.5,64.6c0-2.3-1.8-4.1-4.1-4.1h-12.9c-2.3,0-4.1,1.8-4.1,4.1 0,2.3 1.8,4.1 4.1,4.1h12.9c2.2,1.42109e-14 4.1-1.8 4.1-4.1z" />
            <path d="m10.6,68.7h12.9c2.3,0 4.1-1.8 4.1-4.1 0-2.3-1.8-4.1-4.1-4.1h-12.9c-2.3,0-4.1,1.8-4.1,4.1 0,2.3 1.9,4.1 4.1,4.1z" />
            <path d="m102.6,106.8c1,0 2.1-0.4 2.9-1.2 1.6-1.6 1.6-4.2 0-5.8l-9.1-9.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l9.1,9.1c0.8,0.8 1.9,1.2 2.9,1.2z" />
            <path d="m38.4,38.5c1.6-1.6 1.6-4.2 0-5.8l-9.1-9.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l9.1,9.1c0.8,0.8 1.8,1.2 2.9,1.2s2.1-0.4 2.9-1.2z" />
          </g>
        </g>
      </svg>
    );
  } else {
    return null;
  }
};

const ThemeSwitch = (
  props: Props & { onChange: (value: 'dark' | 'light') => void }
) => {
  const isDark = props.type === 'dark';

  return (
    <ThemeSwitchDiv>
      <Label class="switch-wrap" isDark={isDark}>
        <Input
          type="checkbox"
          checked={isDark}
          onChange={() => {
            props.onChange(isDark ? 'light' : 'dark');
          }}
        />
        <Switch class="switch"></Switch>
      </Label>
      <ThemeIcon type={isDark ? 'dark' : 'light'} />
    </ThemeSwitchDiv>
  );
};

const Label = styled.label`
  cursor: pointer;
  background: ${props => (props.isDark ? '#6200ee' : '#000')};
  padding: 3px;
  width: 33px;
  height: 20px;
  border-radius: 33.5px;
  display: grid;
  margin-right: 5px;
`;
const ThemeSwitchDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + .switch {
    grid-template-columns: 1fr 1fr 0fr;
  }
`;
const Switch = styled.div`
  height: 14px;
  width: 26px;
  display: grid;
  grid-template-columns: 0fr 1fr 1fr;
  transition: 0.2s;
  &:after {
    content: '';
    border-radius: 50%;
    background: #fff;
    grid-column: 2;
    transition: background 0.2s;
  }
`;

export default ThemeSwitch;
