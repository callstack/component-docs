declare module '@mdx-js/mdx' {
  export function sync(
    text: string,
    options: {
      filepath: string;
      hastPlugins?: (() => (tree: any) => void)[];
    }
  ): string;
}
