import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button';

interface Props {
  hangup: () => void;
  join: () => void;
}

const GettingCall = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          backGroundColor="green"
          content="join"
          onPress={props.join}
          style={{
            marginRight: 30,
          }}
        />
        <Button
          backGroundColor="red"
          content="hangup"
          onPress={props.hangup}
          style={{
           
          }}
        />
      </View>
    </View>
  );
};

export default GettingCall

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    bottom: 30
  }
});