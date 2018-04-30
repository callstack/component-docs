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

const REACT_STATIC_METHODS = ['getDerivedStateFromProps'];

const getTypeName = (flowType: TypeAnnotation) =>
  flowType.raw || flowType.name || '';

const PropTypeDoc = ({
  name,
  description,
  flowType,
  type,
  required,
  defaultValue,
}: *) => {
  const isRequired = required && !description.startsWith('@optional');
  const typeName =
    // eslint-disable-next-line no-nested-ternary
    flowType ? getTypeName(flowType) : type ? getTypeName(type) : null;

  return (
    <div className={propInfo}>
      <a className={propLabel} name={name} href={`#${name}`}>
        <code>{name}</code>
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
      {description ? (
        <Markdown
          className={names(propItem, markdown)}
          source={description.replace(/^@optional/, '').trim()}
        />
      ) : null}
    </div>
  );
};

const MethodDoc = ({ name, description, type, params, returns }) => {
  const typeName = type ? getTypeName(type) : null;

  return (
    <div className={propInfo} key={name}>
      <a className={propLabel} name={name} href={`#${name}`}>
        <code>{name}</code>
      </a>

      {typeName && typeName !== 'unknown' ? (
        <div className={propItem}>
          <span>Type: </span>
          <code>{typeName}</code>
        </div>
      ) : null}
      {params.length ? (
        <div className={propItem}>
          <span>Params: </span>
          <code>
            {params
              .map(p => `${p.name}${p.type ? `: ${getTypeName(p.type)}` : ''}`)
              .join(', ')}
          </code>
        </div>
      ) : null}
      {returns && returns.type ? (
        <div className={propItem}>
          <span>Returns: </span>
          <code>{getTypeName(returns.type)}</code>
        </div>
      ) : null}
      {description ? (
        <Markdown
          className={names(propItem, markdown)}
          source={description.trim()}
        />
      ) : null}
    </div>
  );
};

const PropertyDoc = ({ name, description, type, value }: *) => {
  const typeName = type ? getTypeName(type) : null;

  return (
    <div className={propInfo}>
      <a className={propLabel} name={name} href={`#${name}`}>
        <code>{name}</code>
      </a>
      {typeName && typeName !== 'unknown' ? (
        <div className={propItem}>
          <span>Type: </span>
          <code>{typeName}</code>
        </div>
      ) : null}
      {value ? (
        <div className={propItem}>
          <span>Value: </span>
          <code>{value}</code>
        </div>
      ) : null}
      {description ? (
        <Markdown
          className={names(propItem, markdown)}
          source={description.replace(/^@optional/, '').trim()}
        />
      ) : null}
    </div>
  );
};

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

  const keys = Object.keys(info.props).filter(
    prop => !info.props[prop].description.startsWith('@internal')
  );
  const methods = info.methods.filter(
    method =>
      !(
        method.name.startsWith('_') ||
        method.modifiers.includes('static') ||
        (method.description && method.description.startsWith('@internal'))
      )
  );
  const statics = info.statics
    .map(prop => ({
      type: 'property',
      info: prop,
    }))
    .concat(
      info.methods
        .filter(
          method =>
            method.modifiers.includes('static') &&
            !REACT_STATIC_METHODS.includes(method.name)
        )
        .map(method => ({
          type: 'method',
          info: {
            ...method,
            type: { raw: 'Function' },
          },
        }))
    )
    .filter(
      item =>
        !(
          item.info.name.startsWith('_') ||
          (item.info.description &&
            item.info.description.startsWith('@internal'))
        )
    );

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
          {keys.map(prop => (
            <PropTypeDoc key={prop} name={prop} {...info.props[prop]} />
          ))}
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
      {methods.length ? (
        <React.Fragment>
          <h2 className={propsHeader}>Methods</h2>
          {methods.map(method => (
            <MethodDoc key={method.name} type={null} {...method} />
          ))}
        </React.Fragment>
      ) : null}
      {statics.length ? (
        <React.Fragment>
          <h2 className={propsHeader}>Static properties</h2>
          {statics.map(s => {
            if (s.type === 'method') {
              return <MethodDoc key={s.info.name} {...s.info} />;
            }

            return <PropertyDoc key={s.info.name} {...s.info} />;
          })}
        </React.Fragment>
      ) : null}
    </div>
  );
}
