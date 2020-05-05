import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';

const DialogSimpleUsage = () => {
  const [showDialog, setShowDialog] = React.useState(true);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Button onPress={() => setShowDialog(true)}>Show Dialog</Button>
        <Portal>
          <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Paragraph>This is simple dialog</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowDialog(false)}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 48,
  },
});

export default DialogSimpleUsage;
