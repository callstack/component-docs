/* @flow */

import * as React from 'react';
import Remarkable from 'react-remarkable';
import { highlight, getLanguage } from 'illuminate-js';

export default function Markdown(props: any) {
  const { source, className, ...rest } = props;
  return (
    <div {...rest} className={`${className}`}>
      <Remarkable
        source={source}
        options={{
          linkify: true,
          highlight: (text, language) =>
            getLanguage(language) ? highlight(text, language) : null,
        }}
      />
    </div>
  );
}
