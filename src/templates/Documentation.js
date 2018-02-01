/* @flow */

import * as React from 'react';
import { css, names } from 'linaria';
import Markdown from './Markdown';

const container = css`
  padding: 0 12px;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const title = css`
  font-size: 36px;
  margin: 0 0 8px 0;

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

const propLabel = css`
  display: block;
  color: inherit;
  font-size: 20px;
  margin: 24px 0 8px 0;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: inherit;
  }

  & > code {
    font-size: inherit;
    background-color: transparent;
    border: 0;
  }
`;

const propItem = css`
  margin: 8px 0;

  & > code {
    font-size: inherit;
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
      <h1 className={title}>{name}</h1>
      <Markdown
        className={markdown}
        source={description}
        options={{ linkify: true }}
      />
      <h2 className={propsHeader}>Props</h2>
      {Object.keys(info.props).map(prop => {
        const { flowType, type, required, defaultValue } = info.props[prop];
        const details = info.props[prop].description;

        if (details.startsWith('@internal')) {
          return null;
        }

        const isRequired = required && !details.startsWith('@optional');
        const typeName =
          (!flowType || flowType.name === 'any') && type
            ? type.raw || type.name
            : flowType.raw || flowType.name;

        return (
          <div className={propInfo} key={prop}>
            <a className={propLabel} name={prop} href={`#${prop}`}>
              <code>{prop}</code>
              {isRequired ? ' (required)' : ''}
            </a>
            {typeName && typeName !== 'unknown' ? (
              <div className={propItem}>
                <span>Type: </span>
                <code>{typeName}</code>
              </div>
            ) : null}
            {defaultValue ? (
              <div className={propItem}>
                <span>Default value: </span>
                <code>{defaultValue.value}</code>
              </div>
            ) : null}
            <Markdown
              className={names(propItem, markdown)}
              source={details.replace(/^@optional/, '').trim()}
            />
          </div>
        );
      })}
      {restProps && restProps.length
        ? restProps.map(prop => (
            <a
              className={names(propLabel, rest)}
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
