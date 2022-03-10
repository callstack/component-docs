/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';
import color from 'color';
import type { TypeAnnotation, Docs } from '../types';
import Content from './Content';
import Markdown from './Markdown';
import EditButton from './EditButton';

type Props = {
  name: string,
  info: Docs,
  filepath: string,
  logo?: string,
  github?: string,
  colors?: {
    primary?: string,
    annotations?: { [key: string]: string },
  },
};

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 0;
`;

const MarkdownContent = styled(Markdown)`
  p:first-of-type {
    margin-top: 0;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  .badge {
    border-radius: 15px;
    border-style: solid;
    border-width: 1px;
    font-weight: 600;
    text-align: center;
    padding: 4px 8px;
    font-size: smaller;
    margin-left: 8px;

    .dark-theme & {
      color: white;
    }
  }

  .supported {
    border-color: #6200ee;
    background-color: ${color('#6200ee')
      .alpha(0.2)
      .rgb()
      .string()};
    color: #6200ee;
  }

  .renamed {
    border-color: #006400;
    background-color: ${color('#006400')
      .alpha(0.2)
      .rgb()
      .string()};
    color: #006400;
  }

  .deprecated {
    border-color: #b00020;
    background-color: ${color('#B00020')
      .alpha(0.2)
      .rgb()
      .string()};
    color: #b00020;
  }
`;

const PropInfo = styled.div`
  margin: 14px 0;
`;

const PropLabelWrapper = styled.div`
  align-items: center;
  display: flex;
  margin: 24px 0 8px 0;
`;

const PropLabel = styled.a`
  display: block;
  color: inherit;
  font-size: 18px;
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

const PropItem = styled.div`
  margin: 8px 0;

  & > code {
    font-size: inherit;
    white-space: normal;
  }
`;

const RestPropsLabel = styled.a`
  display: block;
  margin: 24px 0 8px 0;
`;

const Badge = styled.div`
  border-radius: 15px;
  border-color: ${props => props.color};
  background-color: ${props =>
    color(props.color)
      .alpha(0.2)
      .rgb()
      .string()};
  border-style: solid;
  border-width: 1px;
  font-weight: 600;
  text-align: center;
  padding: 4px 8px;
  font-size: smaller;
  margin-left: 8px;
  color: ${props => props.color};

  .dark-theme & {
    color: white;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const REACT_STATIC_METHODS = ['getDerivedStateFromProps'];

const ANNOTATION_OPTIONAL = '@optional';
const ANNOTATION_INTERNAL = '@internal';
const ANNOTATION_EXTENDS = '@extends';
const ANNOTATION_BADGES = ['@supported', '@renamed', '@deprecated'];

const getTypeName = (type: TypeAnnotation) => type.raw || type.name || '';

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
  tsType,
  type,
  required,
  defaultValue,
  colors,
}: *) => {
  const isRequired =
    required &&
    defaultValue == null &&
    !description.startsWith(ANNOTATION_OPTIONAL);

  const typeName =
    // eslint-disable-next-line no-nested-ternary
    flowType
      ? getTypeName(flowType)
      : tsType
      ? getTypeName(tsType)
      : type
      ? getTypeName(type)
      : null;

  const badge =
    description && ANNOTATION_BADGES.find(i => i == description.split(' ')[0]);
  const containsBadge = description && badge && description.startsWith(badge);
  const badgeLine = containsBadge ? description.split('\n')[0] : null;
  const badgeColor =
    badge &&
    colors &&
    colors.annotations &&
    colors.annotations[badge.replace('@', '')];
  const badgeDescription =
    containsBadge && badgeLine
      ? badgeLine.replace(badge || '', '').trim()
      : null;

  return (
    <PropInfo>
      <PropLabelWrapper>
        <PropLabel name={name} href={`#${name}`}>
          <code>{name}</code>
          {isRequired ? ' (required)' : ''}
        </PropLabel>
        {badge && <Badge color={badgeColor}>{badgeDescription}</Badge>}
      </PropLabelWrapper>
      {typeName && typeName !== 'unknown' ? (
        <PropItem>
          <span>Type: </span>
          <code>{typeName}</code>
        </PropItem>
      ) : null}
      {defaultValue ? (
        <PropItem>
          <span>Default value: </span>
          <code>{defaultValue.value}</code>
        </PropItem>
      ) : null}
      {description ? (
        <PropItem
          as={MarkdownContent}
          source={description
            .replace(/^@optional/, '')
            .replace(badgeLine || '', '')
            .trim()}
        />
      ) : null}
    </PropInfo>
  );
};

const MethodDoc = ({ name, description, type, params, returns }) => {
  const typeName = type ? getTypeName(type) : null;

  return (
    <PropInfo key={name}>
      <PropLabel name={name} href={`#${name}`}>
        <code>{name}</code>
      </PropLabel>

      {typeName && typeName !== 'unknown' ? (
        <PropItem>
          <span>Type: </span>
          <code>{typeName}</code>
        </PropItem>
      ) : null}
      {params.length ? (
        <PropItem>
          <span>Params: </span>
          <code>
            {params
              .map(p => `${p.name}${p.type ? `: ${getTypeName(p.type)}` : ''}`)
              .join(', ')}
          </code>
        </PropItem>
      ) : null}
      {returns && returns.type ? (
        <PropItem>
          <span>Returns: </span>
          <code>{getTypeName(returns.type)}</code>
        </PropItem>
      ) : null}
      {description ? (
        <PropItem as={MarkdownContent} source={description.trim()} />
      ) : null}
    </PropInfo>
  );
};

const PropertyDoc = ({ name, description, type, value, link }: *) => {
  const typeName = type ? getTypeName(type) : null;

  return (
    <PropInfo>
      <PropLabel
        name={name}
        href={`${typeName === 'static' && link ? `${link}` : `#${name}`}`}
      >
        <code>{name}</code>
      </PropLabel>
      {typeName && typeName !== 'unknown' ? (
        <PropItem>
          <span>Type: </span>
          <code>{typeName}</code>
        </PropItem>
      ) : null}
      {typeof value === 'string' || typeof value === 'number' ? (
        <PropItem>
          <span>Value: </span>
          <code>{value}</code>
        </PropItem>
      ) : null}
      {description ? (
        <PropItem
          as={MarkdownContent}
          source={description.replace(/^@optional/, '').trim()}
        />
      ) : null}
    </PropInfo>
  );
};

export default function Documentation({
  name,
  info,
  logo,
  github,
  filepath,
  colors,
}: Props) {
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

  const props = info.props || {};

  const keys = Object.keys(props).filter(
    prop => !hasAnnotation(props[prop], ANNOTATION_INTERNAL)
  );
  const methods = info.methods.filter(
    method =>
      !(
        method.name.startsWith('_') ||
        method.modifiers.includes('static') ||
        method.docblock == null ||
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
            method.docblock != null &&
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

  const badge =
    description && ANNOTATION_BADGES.find(i => i == description.split(' ')[0]);
  const containsBadge = description && badge && description.startsWith(badge);
  const badgeLine = containsBadge ? description.split('\n')[0] : null;
  const badgeColor =
    badge &&
    colors &&
    colors.annotations &&
    colors.annotations[badge.replace('@', '')];
  const badgeDescription =
    containsBadge && badgeLine
      ? badgeLine.replace(badge || '', '').trim()
      : null;

  return (
    <Content logo={logo}>
      <TitleWrapper>
        <Title>{name}</Title>
        {badge && <Badge color={badgeColor}>{badgeDescription}</Badge>}
      </TitleWrapper>
      <MarkdownContent
        source={description.replace(badgeLine || '', '')}
        options={{ linkify: true }}
      />
      {keys.length || restProps.length ? (
        <React.Fragment>
          <h2>Props</h2>
          {keys.map(prop => (
            <PropTypeDoc
              key={prop}
              name={prop}
              colors={colors}
              {...props[prop]}
            />
          ))}
          {restProps.map(prop => (
            <RestPropsLabel key={prop.name} href={prop.link}>
              <code>
                ...
                {prop.name}
              </code>
            </RestPropsLabel>
          ))}
        </React.Fragment>
      ) : null}
      {methods.length ? (
        <React.Fragment>
          <h2>Methods</h2>
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
          <h2>Static properties</h2>
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
      <EditButton github={github} filepath={filepath} />
    </Content>
  );
}
