import * as React from 'react';

/**
 * Include SnackPlayer by adding @SnackPlayer followed by the example component filename.
 *
 * Example:
 * @SnackPlayer Button.SimpleUsage.js
 *
 */

const SnackPlayer = ({ snackPlayer }) => {
  React.useEffect(() => window.ExpoSnack && window.ExpoSnack.initialize(), []);

  const code = encodeURIComponent(snackPlayer.code);

  // https://github.com/expo/snack-sdk/blob/master/Snack_for_module_authors.md#parameters
  return (
    <div className="snack-player" style={{ marginTop: 15, marginBottom: 15 }}>
      <div
        data-snack-code={code}
        data-snack-name={snackPlayer.name}
        data-snack-platform="web"
        data-snack-preview="true"
        data-snack-dependencies={[
          'react-native-paper',
          'react-native-vector-icons/MaterialIcons',
        ]}
        style={{
          overflow: 'hidden',
          background: '#fafafa',
          border: '1px solid rgba(0,0,0,.08)',
          borderRadius: '4px',
          height: '505px',
          width: '100%',
        }}
      />
    </div>
  );
};

export default SnackPlayer;
