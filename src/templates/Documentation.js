/* @flow */

import * as React from 'react';
import { css, names } from 'linaria';
import Markdown from './Markdown';
import type { TypeAnnotation, Docs } from '../types';

type Props = {
  name: string,
  info: Docs,
};

const container = css`
  padding: 0 12px;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const title = css`
  font-size: 36px;
  margin: 0 0 8px 0;
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
    white-space: normal;
  }
`;

const rest = css`
  color: #1976d2;
  font-size: 16px;
`;

const getTypeName = (flowType: TypeAnnotation) => flowType.raw || flowType.name;

export default function Documentation({ name, info }: Props) {
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

  const keys = Object.keys(info.props);

  return (
    <div className={container}>
      <h1 className={title}>{name}</h1>
      <Markdown
        className={markdown}
        source={description}
        options={{ linkify: true }}
      />
      {keys.length || restProps.length ? (
        <React.Fragment>
          <h2 className={propsHeader}>Props</h2>
          {keys.map(prop => {
            const {
              flowType,
              type,
              required,
              defaultValue,
              description: details,
            } = info.props[prop];

            if (details.startsWith('@internal')) {
              return null;
            }

            const isRequired = required && !details.startsWith('@optional');
            const typeName =
              // eslint-disable-next-line no-nested-ternary
              flowType && flowType.name !== 'any'
                ? getTypeName(flowType)
                : type
                  ? getTypeName(type)
                  : null;

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
          {restProps.map(prop => (
            <a
              className={names(propLabel, rest)}
              key={prop.name}
              href={prop.link}
            >
              <code>...{prop.name}</code>
            </a>
          ))}
        </React.Fragment>
      ) : null}
      {info.methods.length ? (
        <React.Fragment>
          <h2 className={propsHeader}>Methods</h2>
          {info.methods.map(method => {
            if (method.name.startsWith('_')) {
              return null;
            }

            if (
              method.description &&
              method.description.startsWith('@internal')
            ) {
              return null;
            }

            return (
              <div className={propInfo} key={method.name}>
                <a
                  className={propLabel}
                  name={method.name}
                  href={`#${method.name}`}
                >
                  <code>{method.name}</code>
                </a>
                {method.params.length ? (
                  <div className={propItem}>
                    <span>Params: </span>
                    <code>
                      {method.params
                        .map(
                          p =>
                            `${p.name}${
                              p.type ? `: ${getTypeName(p.type)}` : ''
                            }`
                        )
                        .join(', ')}
                    </code>
                  </div>
                ) : null}
                {method.returns && method.returns.type ? (
                  <div className={propItem}>
                    <span>Returns: </span>
                    <code>{getTypeName(method.returns.type)}</code>
                  </div>
                ) : null}
                {method.description ? (
                  <Markdown
                    className={names(propItem, markdown)}
                    source={method.description.trim()}
                  />
                ) : null}
              </div>
            );
          })}
        </React.Fragment>
      ) : null}
    </div>
  );
}
