/* @flow */

import React from 'react';
import { css } from '../lib/styling';
import Markdown from './Markdown';

const title = css`
  font-size: 36px;
  margin: 0 0 8px -24px;
`;

const markdown = css`
  & p:first-child {
    margin-top: 0;
  }

  & p:last-child {
    margin-bottom: 0;
  }
`;

const propsHeader = css`
  font-size: 24px;
  line-height: 1;
  color: #000;
  margin: 48px 0 16px;
`

const propInfo = css`
  position: relative;
  margin: 16px 0;
`

const propRequired = css`
  position: absolute;
  left: -24px;
  font-size: 22px;
  line-height: 1.5;
  color: #C1C2CA;

  &:hover:after {
    content: attr(data-hint);
    display: inline-block;
    position: absolute;
    left: 0;
    border-radius: 3px;
    bottom: 32px;
    padding: 2px 8px;
    font-size: 12px;
    color: #fff;
    background: #262939;
    z-index: 10;
  }
`

const propLabel = css`
  background-color: #F3F3F7;
  border-radius: 3px;
  padding: 4px 8px;
  margin: 4px 16px 4px 0;
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, .04);
`

const propDetails = css`
  margin: 8px 0;

  @media(min-width: 960px) {
    display: inline-block;
  }
`

const rest = css`
  color: #1976D2;
`

export default function ComponentDocs({ name, info }: any) {
  const restProps = [];
  const description = info.description.split('\n').filter(line => {
    if (line.startsWith('@extends ')) {
      const parts = line.split(' ').slice(1);
      const link = parts.pop();
      restProps.push({
        name: parts.join(' '),
        link,
      });
      return false;
    }
    return true;
  }).join('\n');

  return (
    <div>
      <h1 className={title}><code>{`<${name} />`}</code></h1>
      <Markdown
        className={markdown}
        source={description} options={{ linkify: true }}
      />
      <h2 className={propsHeader}>Props</h2>
      {Object.keys(info.props).map(prop => {
        const { flowType, type, required } = info.props[prop];
        return (
          <div className={propInfo} key={prop}>
            <span>
              <code
                className={propRequired}
                data-hint='required'
              >
                {required ? '*' : ''}
              </code>
              <a
                className={propLabel}
                name={prop}
                href={`#${prop}`}
              >
                <code>
                  {prop}: {flowType.name === 'any' && type ? (type.raw || type.name) : (flowType.raw || flowType.name)}
                </code>
              </a>
            </span>
            <Markdown
              className={propDetails}
              source={info.props[prop].description}
            />
          </div>
        );
      })}
      {restProps && restProps.length ? restProps.map(prop => (
        <a
          className={`${propLabel} ${rest}`}
          key={prop.name}
          href={prop.link}
        >
          <code>
            ...{prop.name}
          </code>
        </a>
      )) : null}
    </div>
  );
}
