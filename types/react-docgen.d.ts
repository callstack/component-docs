declare module 'react-docgen' {
  import { namedTypes } from 'ast-types';

  export type Documentation = {
    displayName?: string;
    description: string;
    props?: {
      [prop: string]: {
        description: string;
        required?: boolean;
        defaultValue?: {
          value: string | number;
        };
        flowType?: {
          name?: string;
          raw: string;
        };
        tsType?: {
          name?: string;
          raw: string;
        };
        type?: {
          name?: string;
          raw: string;
        };
      };
    };
    methods: Array<{
      name: string;
      description?: string;
      docblock?: string;
      params: Array<{
        name: string;
        type?: {
          name?: string;
          raw: string;
        };
      }>;
      returns?: {
        type?: {
          name?: string;
          raw: string;
        };
      };
      modifiers: Array<'static' | 'generator' | 'async'>;
    }>;
    statics: Array<{
      name: string;
      description?: string;
      type?: {
        name?: string;
        raw: string;
      };
      value?: string;
      link?: string;
    }>;

    set<T extends keyof Documentation>(type: T, value: Documentation[T]): void;
  };

  export type Node = namedTypes.Node & {
    static?: boolean;
    key: { name: string };
    value: { value: string };
  };

  export type PropertyPath = {
    node: Node;
    get(...args: string[]): { node: Node }[];
  };

  export function parse(
    text: string,
    what: any,
    handlers: ((docs: Documentation, propertyPath: PropertyPath) => void)[],
    options: {
      cwd: string;
      filename: string;
    }
  ): Documentation;

  export const defaultHandlers: ((
    docs: Documentation,
    propertyPath: PropertyPath
  ) => void)[];

  export const utils: {
    getTypeAnnotation(path: { node: Node }): { name: string; raw: string };
    getFlowType(type: {
      name: string;
      raw: string;
    }): { name: string; raw: string };

    docblock: {
      getDocblock(p: any): any;
    };
  };
}
