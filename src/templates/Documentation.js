/* @flow */

import * as React from 'react';
import { css } from '../lib/styling';
import Markdown from './Markdown';

const container = css`
  padding: 0 12px;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const title = css`
  font-size: 36px;
  margin: 0 0 8px -24px;

  & > code {
    background-color: transparent;
    border: 0;
  }
`;

const markdown = css`
  p:first-of-type {
    margin-top: 0;
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`;

const propsHeader = css`
  font-size: 24px;
  line-height: 1;
  color: #000;
  margin: 48px 0 16px;
`;

const propInfo = css`
  margin: 16px 0;
`;

const propRequired = css`
  position: absolute;
  top: -2px;
  left: -18px;
  font-size: 22px;
  line-height: 1;
  color: #c1c2ca;
  background-color: transparent;
  border: 0;

  &:hover:after {
    content: attr(data-hint);
    display: inline-block;
    position: absolute;
    left: 0;
    border-radius: 2px;
    bottom: 32px;
    padding: 4px 8px;
    font-size: 12px;
    color: #fff;
    background: #262939;
    z-index: 10;
  }
`;

const propLabelContainer = css`
  position: relative;
`;

const propLabel = css`
  color: inherit;
  background-color: #f3f3f7;
  border-radius: 2px;
  padding: 4px 8px;
  margin: 4px 16px 4px 0;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: inherit;
  }

  & > code {
    background-color: transparent;
    border: 0;
  }
`;

const propDetails = css`
  margin: 8px 0;

  @media (min-width: 960px) {
    display: inline-block;
  }
`;

const rest = css`
  color: #1976d2;
`;

export default function Documentation({ name, info }: any) {
  const restProps = [];
  const description = info.description
    .split('\n')
    .filter(line => {
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
    })
    .join('\n');

  return (
    <div className={container}>
      <h1 className={title}>
        <code>{`<${name} />`}</code>
      </h1>
      <Markdown
        className={markdown}
        source={description}
        options={{ linkify: true }}
      />
      <h2 className={propsHeader}>Props</h2>
      {Object.keys(info.props).map(prop => {
        const { flowType, type, required } = info.props[prop];
        return (
          <div className={propInfo} key={prop}>
            <span className={propLabelContainer}>
              <code className={propRequired} data-hint="required">
                {required ? '*' : ''}
              </code>
              <a className={propLabel} name={prop} href={`#${prop}`}>
                <code>
                  {prop}:{' '}
                  {(!flowType || flowType.name === 'any') && type
                    ? type.raw || type.name
                    : flowType.raw || flowType.name}
                </code>
              </a>
            </span>
            <Markdown
              className={`${propDetails} ${markdown}`}
              source={info.props[prop].description}
            />
          </div>
        );
      })}
      {restProps && restProps.length
        ? restProps.map(prop => (
            <a
              className={`${propLabel} ${rest}`}
              key={prop.name}
              href={prop.link}
            >
              <code>...{prop.name}</code>
            </a>
          ))
        : null}
    </div>
  );
}
