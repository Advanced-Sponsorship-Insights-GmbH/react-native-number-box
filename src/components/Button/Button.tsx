import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

function _handlePress(callback: () => void) {
  requestAnimationFrame(callback);
}

const Button = ({ onPress = () => {}, ...props }: ButtonProps) => {
  return Platform.OS === 'ios' ? (
    <TouchableOpacity
      disabled={props.disabled}
      style={props.style}
      onPress={() => _handlePress(onPress)}
    >
      {props.children}
    </TouchableOpacity>
  ) : (
    <TouchableNativeFeedback
      disabled={props.disabled}
      onPress={() => _handlePress(onPress)}
    >
      <View style={props.style}>{props.children}</View>
    </TouchableNativeFeedback>
  );
};

type ButtonProps = {
  disabled?: boolean;
  style?: any;
  onPress?: () => void;
  children?: any;
};

export default Button;
