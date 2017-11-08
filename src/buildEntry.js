/* @flow */

import fs from 'fs';

export default function buildEntry({
  output,
  layout,
}: {
  output: string,
  layout: string,
}) {
  const data = `
import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import App from '${require.resolve('./templates/App')}';
import Layout from '${layout}';
import data from './app.data.json';

const root = document.getElementById('root');
const render = () => {
  try {
    ReactDOM.hydrate(
      <App
        name={window.__INITIAL_PATH__}
        data={data}
        layout={Layout}
      />,
      root
    );
  } catch (e) {
    ReactDOM.render(
      <RedBox error={e} />,
      root
    );
  }
};

if (module.hot) {
  module.hot.accept(() => {
    setTimeout(render);
  });
}

render();
`;

  fs.writeFileSync(output, data);
}
