import path from 'path';

export default function (file: string): string {
  return path
    .parse(file)
    .name.replace(/^\d+(\.|-)/, '')
    .trim();
}
