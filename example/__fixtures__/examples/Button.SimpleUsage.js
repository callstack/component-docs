import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ButtonSimpleUsage = () => (
  <PaperProvider>
    <View style={styles.container}>
      <Button onPress={() => {}}>Default</Button>
      <Button
        onPress={() => {}}
        icon={props => <Icon name="add-a-photo" {...props} />}
      >
        Icon
      </Button>
      <Button onPress={() => {}} loading>
        Loading
      </Button>
    </View>
  </PaperProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 48,
  },
});

export default ButtonSimpleUsage;
