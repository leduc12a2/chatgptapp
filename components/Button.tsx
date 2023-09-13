import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

interface Props {
  onPress: any;
  iconName?: string;
  backGroundColor: string;
  style?: any;
  content: string;
}

const Button = (props: Props) => {
  const {onPress, backGroundColor, iconName, style, content} = props;
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={[
          {backgroundColor: props.backGroundColor},
          style,
          styles.button,
        ]}>
        <Text style={{color: "white"}}>{content}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
   width: 80,
   height: 80,
   padding: 10,
   elevation: 10,
   justifyContent: 'center',
   alignItems: 'center',
   borderRadius: 100
  },
});
