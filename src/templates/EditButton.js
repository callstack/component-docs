/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';

type Props = {
  filepath: string,
  github?: string,
};

const EditButtonContainer = styled.a`
  display: inline-block;
  vertical-align: middle;
  margin-top: 32px;

  svg {
    stroke: currentColor;
    margin-right: 8px;
    margin-bottom: -2px;
  }
`;

export default function EditButton({ github, filepath }: Props) {
  return github ? (
    <EditButtonContainer target="_blank" href={`${github}/${filepath}`}>
      <svg width="16px" height="16px" viewBox="0 0 18 20">
        <path
          fill="none"
          transform="translate(2.000000, 2.000000)"
          d="M1.5,14.5363545 L1.5,11.3292488 L9.36649374,3.4627884 L12.5735698,6.66982438 L4.7071064,14.5363545 L1.5,14.5363545 Z M14.1535993,5.08986045 L12.5666426,6.67673666 L9.35957774,3.46971186 L10.9465031,1.88274634 C11.4083588,1.42089061 12.1250348,1.42089061 12.5868905,1.88274634 L14.1536082,3.44946407 C14.6154639,3.91131979 14.6154639,4.62799577 14.1536082,5.08985149 Z"
        />
      </svg>
      Edit this page
    </EditButtonContainer>
  ) : null;
}
