/* @flow */

import * as React from 'react';
import { css } from 'linaria';

type Props = {
  filepath: string,
  github?: string,
};

const editButton = css`
  display: block;
  position: absolute;
  top: 0;
  right: 48px;
  padding: 30px;
  z-index: 10;
  color: inherit;

  &:focus,
  &:hover,
  &:active {
    color: inherit;
  }

  @media (min-width: 640px) {
    padding: 32px;
    right: 0;
  }

  svg {
    stroke: currentColor;
  }
`;

export default function EditButton({ github, filepath }: Props) {
  return github ? (
    <a className={editButton} target="_blank" href={`${github}/${filepath}`}>
      <svg width="18px" height="20px" viewBox="0 0 18 20">
        <path
          fill="none"
          transform="translate(2.000000, 2.000000)"
          d="M1.5,14.5363545 L1.5,11.3292488 L9.36649374,3.4627884 L12.5735698,6.66982438 L4.7071064,14.5363545 L1.5,14.5363545 Z M14.1535993,5.08986045 L12.5666426,6.67673666 L9.35957774,3.46971186 L10.9465031,1.88274634 C11.4083588,1.42089061 12.1250348,1.42089061 12.5868905,1.88274634 L14.1536082,3.44946407 C14.6154639,3.91131979 14.6154639,4.62799577 14.1536082,5.08985149 Z"
        />
      </svg>
    </a>
  ) : null;
}
