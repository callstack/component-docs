/* @flow */

import * as React from 'react';
import { css, cx } from 'linaria';
import Content from './Content';
import Markdown from './Markdown';
import EditButton from './EditButton';
import type { TypeAnnotation, Docs } from '../types';

type Props = {
  name: string,
  info: Docs,
  filepath: string,
  github?: string,
};

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

const ANNOTATION_OPTIONAL = '@optional';
const ANNOTATION_INTERNAL = '@internal';
const ANNOTATION_EXTENDS = '@extends';

const getTypeName = (flowType: TypeAnnotation) =>
  flowType.raw || flowType.name || '';

const hasAnnotation = (item: any, annotation: string) =>
  // eslint-disable-next-line no-nested-ternary
  item.description
    ? item.description.startsWith(annotation)
    : item.docblock
    ? item.docblock.startsWith(annotation)
    : false;

const pascalToCamelCase = (text: string) =>
  text.replace(/^[A-Z]+/g, $1 => $1.toLowerCase());

const PropTypeDoc = ({
  name,
  description,
  flowType,
  type,
  required,
  defaultValue,
}: *) => {
  const isRequired =
    required &&
    defaultValue == null &&
    !description.startsWith(ANNOTATION_OPTIONAL);

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
          className={cx(propItem, markdown)}
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
          className={cx(propItem, markdown)}
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
      {typeof value === 'string' || typeof value === 'number' ? (
        <div className={propItem}>
          <span>Value: </span>
          <code>{value}</code>
        </div>
      ) : null}
      {description ? (
        <Markdown
          className={cx(propItem, markdown)}
          source={description.replace(/^@optional/, '').trim()}
        />
      ) : null}
    </div>
  );
};

export default function Documentation({ name, info, github, filepath }: Props) {
  const restProps = [];
  const description = info.description
    .split('\n')
    .filter(line => {
      if (line.startsWith(ANNOTATION_EXTENDS)) {
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
    prop => !hasAnnotation(info.props[prop], ANNOTATION_INTERNAL)
  );
  const methods = info.methods.filter(
    method =>
      !(
        method.name.startsWith('_') ||
        method.modifiers.includes('static') ||
        hasAnnotation(method, ANNOTATION_INTERNAL)
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
          hasAnnotation(item.info, ANNOTATION_INTERNAL)
        )
    );

  return (
    <Content>
      <EditButton github={github} filepath={filepath} />
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
            <a className={cx(propLabel, rest)} key={prop.name} href={prop.link}>
              <code>
                ...
                {prop.name}
              </code>
            </a>
          ))}
        </React.Fragment>
      ) : null}
      {methods.length ? (
        <React.Fragment>
          <h2 className={propsHeader}>Methods</h2>
          <p>
            These methods can be accessed on the <code>ref</code> of the
            component, e.g.{' '}
            <code>
              {pascalToCamelCase(name)}
              Ref.
              {methods[0].name}
              (...args)
            </code>
            .
          </p>
          {methods.map(method => (
            <MethodDoc key={method.name} type={null} {...method} />
          ))}
        </React.Fragment>
      ) : null}
      {statics.length ? (
        <React.Fragment>
          <h2 className={propsHeader}>Static properties</h2>
          <p>
            These properties can be accessed on <code>{name}</code> by using the
            dot notation, e.g.{' '}
            <code>
              {name}.{statics[0].info.name}
            </code>
            .
          </p>
          {statics.map(s => {
            if (s.type === 'method') {
              return <MethodDoc key={s.info.name} {...s.info} />;
            }

            return <PropertyDoc key={s.info.name} {...s.info} />;
          })}
        </React.Fragment>
      ) : null}
    </Content>
  );
}
