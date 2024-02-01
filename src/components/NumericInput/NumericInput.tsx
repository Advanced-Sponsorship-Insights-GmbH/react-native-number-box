/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../Button';

export default function NumericInput({
  iconSize = 20,
  borderColor = '#d4d4d4',
  iconStyle = {},
  totalWidth = 130,
  totalHeight = 50,
  separatorWidth = 1,
  type = 'plus-minus',
  rounded = false,
  textColor = 'black',
  containerStyle = {},
  inputStyle = {},
  valueType = 'integer',
  value = 0,
  minValue = -1e6,
  // @ts-ignore
  maxValue = null,
  step = 1,
  upDownButtonsBackgroundColor = 'white',
  rightButtonBackgroundColor = 'white',
  leftButtonBackgroundColor = 'white',
  editable = true,
  validateOnBlur = true,
  reachMaxIncIconStyle = {},
  reachMaxDecIconStyle = {},
  reachMinIncIconStyle = {},
  reachMinDecIconStyle = {},
  onLimitReached = () => {},
  extraTextInputProps = {},
  ...rest
}: Props) {
  const props = {
    iconSize,
    borderColor,
    iconStyle,
    totalWidth,
    separatorWidth,
    type,
    rounded,
    textColor,
    containerStyle,
    inputStyle,
    valueType,
    value,
    minValue,
    maxValue,
    step,
    upDownButtonsBackgroundColor,
    rightButtonBackgroundColor,
    leftButtonBackgroundColor,
    editable,
    validateOnBlur,
    reachMaxIncIconStyle,
    reachMaxDecIconStyle,
    reachMinIncIconStyle,
    reachMinDecIconStyle,
    onLimitReached,
    extraTextInputProps,
    totalHeight,
    onChange: rest.onChange ? rest.onChange : () => {},
    onFocus: rest.onFocus,
    onBlur: rest.onBlur,
  };

  const [state, setState] = useState({
    lastValid: props.value || 0,
    legal: true,
  });

  const [inputValue, setInputValue] = useState(props.value || 0);

  const stringValue = String(inputValue);

  const ref = useRef<TextInput>(null);

  const inc = () => {
    const { value: propValue, onChange } = props;
    let localValue = typeof propValue === 'number' ? propValue : inputValue;
    let reachedMax = false;

    if (maxValue === null || localValue + step < maxValue) {
      localValue =
        valueType === 'real'
          ? parseFloat((localValue + step).toFixed(12))
          : parseInt((localValue + step).toFixed(12), 10);
    } else {
      onLimitReached && onLimitReached(true, 'Reached Maximum Value!');
      localValue = maxValue;
      reachedMax = true;
    }

    setInputValue(localValue);

    if ((localValue !== propValue || reachedMax) && onChange) {
      onChange(Number(localValue));
    }
  };

  const dec = () => {
    let currentValue: number | string =
      props.value && typeof props.value === 'number' ? props.value : inputValue;
    if (props.minValue === null || currentValue - props.step > props.minValue) {
      currentValue = (value - props.step).toFixed(12);
      currentValue =
        props.valueType === 'real'
          ? parseFloat(currentValue)
          : parseInt(currentValue, 10);
    } else if (props.minValue !== null) {
      props.onLimitReached(false, 'Reached Minimum Value!');
      currentValue = props.minValue;
    }
    if (currentValue !== props.value)
      props.onChange && props.onChange(Number(currentValue));
    setInputValue(currentValue);
  };

  const isLegalValue = (
    string: string,
    mReal: (val: string) => boolean,
    mInt: (val: string) => boolean
  ) =>
    string === '' ||
    (((props.valueType === 'real' && mReal(string)) ||
      (props.valueType !== 'real' && mInt(string))) &&
      (props.maxValue === null || parseFloat(string) <= props.maxValue) &&
      (props.minValue === null || parseFloat(string) >= props.minValue));

  const realMatch = (string: string): boolean =>
    !!string &&
    !!string.match(/-?\d+(\.(\d+)?)?/) &&
    string.match(/-?\d+(\.(\d+)?)?/)?.[0] ===
      string.match(/-?\d+(\.(\d+)?)?/)?.input;

  const intMatch = (string: string): boolean =>
    !!string &&
    !!string.match(/-?\d+/) &&
    string.match(/-?\d+/)?.[0] === string.match(/-?\d+/)?.input;

  const onChange = (string: string) => {
    let currValue = typeof props.value === 'number' ? props.value : inputValue;
    if (
      (string.length === 1 && string === '-') ||
      (string.length === 2 && string === '0-')
    ) {
      return;
    }
    if (
      (string.length === 1 && string === '.') ||
      (string.length === 2 && string === '0.')
    ) {
      return;
    }
    if (string.charAt(string.length - 1) === '.') {
      return;
    }
    let legal = isLegalValue(string, realMatch, intMatch);
    if (legal) {
      setState((prev) => ({ ...prev, lastValid: parseInt(string, 10) }));
    }
    if (!legal && !props.validateOnBlur) {
      if (ref) {
        ref.current?.blur();
        setTimeout(() => {
          ref.current?.clear();
          setTimeout(() => {
            props.onChange && props.onChange(currValue - 1);
            setInputValue(() => {
              setState((prev) => ({ ...prev, legal }));
              setInputValue(currValue);
              props.onChange && props.onChange(currValue);

              return currValue - 1;
            });
          }, 10);
        }, 15);
        setTimeout(() => ref.current?.focus(), 20);
      }
    } else if (!legal && props.validateOnBlur) {
      let parsedValue =
        props.valueType === 'real' ? parseFloat(string) : parseInt(string, 10);
      parsedValue = isNaN(parsedValue) ? 0 : parsedValue;
      if (parsedValue !== props.value)
        props.onChange && props.onChange(parsedValue);
      setInputValue(parsedValue);
      setState((prev) => ({
        ...prev,
        legal,
      }));
    } else {
      let parsedValue =
        props.valueType === 'real' ? parseFloat(string) : parseInt(string, 10);
      parsedValue = isNaN(parsedValue) ? 0 : parsedValue;
      if (parsedValue !== props.value)
        props.onChange && props.onChange(parsedValue);
      setInputValue(parsedValue);
      setState((prev) => ({
        ...prev,
        legal,
      }));
    }
  };

  const onBlur = () => {
    let match = stringValue.match(/-?[0-9]\d*(\.\d+)?/);
    let legal =
      match &&
      match[0] === match.input &&
      (props.maxValue === null || parseFloat(stringValue) <= props.maxValue) &&
      (props.minValue === null || parseFloat(stringValue) >= props.minValue);
    if (!legal) {
      if (
        props.minValue !== null &&
        parseFloat(stringValue) <= props.minValue
      ) {
        props.onLimitReached(true, 'Reached Minimum Value!');
      }
      if (
        props.maxValue !== null &&
        parseFloat(stringValue) >= props.maxValue
      ) {
        props.onLimitReached(false, 'Reached Maximum Value!');
      }
      if (ref.current) {
        ref.current.blur();
        setTimeout(() => {
          ref.current?.clear();
          setTimeout(() => {
            props.onChange && props.onChange(state.lastValid);
            setInputValue(() => {
              props.onChange && props.onChange(state.lastValid);

              return state.lastValid;
            });
          }, 10);
        }, 15);
        setTimeout(() => ref.current?.focus(), 50);
      }
    }
    props.onBlur && props.onBlur();
  };

  const onFocus = () => {
    setState((prev) => ({ ...prev, lastValid: inputValue }));
    props.onFocus && props.onFocus();
  };

  const iconStyleProps = [style.icon, props.iconStyle];
  const totalHeightProp = props.totalHeight || totalWidth * 0.4;
  const inputWidth =
    props.type === 'up-down' ? totalWidth * 0.6 : totalWidth * 0.4;
  const borderRadiusTotal = totalHeightProp * 0.18;
  const fontSize = totalHeightProp * 0.38;
  const maxReached = inputValue === props.maxValue;
  const minReached = inputValue === props.minValue;

  const inputContainerStyle =
    props.type === 'up-down'
      ? [
          style.inputContainerUpDown,
          {
            width: totalWidth,
            height: totalHeightProp,
            borderColor: borderColor,
          },
          props.rounded ? { borderRadius: borderRadiusTotal } : {},
          props.containerStyle,
        ]
      : [
          style.inputContainerPlusMinus,
          {
            width: totalWidth,
            height: totalHeightProp,
            borderColor: borderColor,
          },
          props.rounded ? { borderRadius: borderRadiusTotal } : {},
          props.containerStyle,
        ];

  const inputStyleProps =
    props.type === 'up-down'
      ? [
          style.inputUpDown,
          {
            width: inputWidth,
            height: totalHeight,
            fontSize: fontSize,
            color: textColor,
            borderRightWidth: 2,
            borderRightColor: borderColor,
          },
          props.inputStyle,
        ]
      : [
          style.inputPlusMinus,
          {
            width: inputWidth,
            height: totalHeight,
            fontSize: fontSize,
            color: textColor,
            borderRightWidth: separatorWidth,
            borderLeftWidth: separatorWidth,
            borderLeftColor: borderColor,
            borderRightColor: borderColor,
          },
          props.inputStyle,
        ];

  const upDownStyle: StyleProp<ViewStyle> = [
    {
      alignItems: 'center',
      width: totalWidth - inputWidth,
      backgroundColor: props.upDownButtonsBackgroundColor,
      borderRightWidth: 1,
      borderRightColor: borderColor,
    },
    props.rounded
      ? {
          borderTopRightRadius: borderRadiusTotal,
          borderBottomRightRadius: borderRadiusTotal,
        }
      : {},
  ];

  const rightButtonStyle = [
    {
      position: 'absolute',
      zIndex: -1,
      right: 0,
      height: totalHeightProp - 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
      backgroundColor: props.rightButtonBackgroundColor,
      width: (totalWidth - inputWidth) / 2,
    },
    props.rounded
      ? {
          borderTopRightRadius: borderRadiusTotal,
          borderBottomRightRadius: borderRadiusTotal,
        }
      : {},
  ];

  const leftButtonStyle = [
    {
      position: 'absolute',
      zIndex: -1,
      left: 0,
      height: totalHeightProp - 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props.leftButtonBackgroundColor,
      width: (totalWidth - inputWidth) / 2,
      borderWidth: 0,
    },
    props.rounded
      ? {
          borderTopLeftRadius: borderRadiusTotal,
          borderBottomLeftRadius: borderRadiusTotal,
        }
      : {},
  ];

  const inputWrapperStyle = {
    alignSelf: 'center',
    borderLeftColor: borderColor,
    borderLeftWidth: separatorWidth,
    borderRightWidth: separatorWidth,
    borderRightColor: borderColor,
  } as const;

  if (props.type === 'up-down')
    return (
      <View style={inputContainerStyle}>
        <TextInput
          {...props.extraTextInputProps}
          editable={editable}
          returnKeyType="done"
          underlineColorAndroid="rgba(0,0,0,0)"
          keyboardType="numeric"
          value={stringValue}
          onChangeText={onChange}
          style={inputStyleProps}
          ref={ref}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <View style={upDownStyle}>
          <Button
            onPress={inc}
            style={{ flex: 1, width: '100%', alignItems: 'center' }}
          >
            <Icon
              name="chevron-up"
              size={fontSize}
              style={[
                ...iconStyleProps,
                maxReached ? props.reachMaxIncIconStyle : {},
                minReached ? props.reachMinIncIconStyle : {},
              ]}
            />
          </Button>
          <Button
            onPress={dec}
            style={{ flex: 1, width: '100%', alignItems: 'center' }}
          >
            <Icon
              name="chevron-down"
              size={fontSize}
              style={[
                ...iconStyleProps,
                maxReached ? props.reachMaxDecIconStyle : {},
                minReached ? props.reachMinDecIconStyle : {},
              ]}
            />
          </Button>
        </View>
      </View>
    );

  return (
    <View style={inputContainerStyle}>
      <Button onPress={dec} style={leftButtonStyle}>
        <Icon
          name="remove"
          size={fontSize}
          style={[
            ...iconStyleProps,
            maxReached ? props.reachMaxDecIconStyle : {},
            minReached ? props.reachMinDecIconStyle : {},
          ]}
        />
      </Button>
      <View style={[inputWrapperStyle]}>
        <TextInput
          {...props.extraTextInputProps}
          editable={editable}
          returnKeyType="done"
          underlineColorAndroid="rgba(0,0,0,0)"
          keyboardType="numeric"
          value={stringValue}
          onChangeText={onChange}
          style={inputStyleProps}
          ref={ref}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </View>
      <Button onPress={inc} style={rightButtonStyle}>
        <Icon
          name="add"
          size={fontSize}
          style={[
            ...iconStyleProps,
            maxReached ? props.reachMaxIncIconStyle : {},
            minReached ? props.reachMinIncIconStyle : {},
          ]}
        />
      </Button>
    </View>
  );
}

const style = StyleSheet.create({
  inputContainerUpDown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderColor: 'grey',
    borderWidth: 1,
  },
  inputContainerPlusMinus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  inputUpDown: {
    textAlign: 'center',
    padding: 0,
  },
  inputPlusMinus: {
    textAlign: 'center',
    padding: 0,
  },
  icon: {
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0)',
  },
});

type Props = {
  iconSize?: number;
  borderColor?: string;
  iconStyle?: any;
  totalWidth?: number;
  totalHeight?: number;
  separatorWidth?: number;
  type?: 'up-down' | 'plus-minus';
  valueType?: 'real' | 'integer';
  rounded?: any;
  textColor?: string;
  containerStyle?: any;
  inputStyle?: any;
  onChange: (value: number) => void;
  onLimitReached?: (isMax: boolean, msg: string) => void;
  value?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  upDownButtonsBackgroundColor?: string;
  rightButtonBackgroundColor?: string;
  leftButtonBackgroundColor?: string;
  editable?: boolean;
  reachMaxIncIconStyle?: any;
  reachMaxDecIconStyle?: any;
  reachMinIncIconStyle?: any;
  reachMinDecIconStyle?: any;
  extraTextInputProps?: any;
  validateOnBlur?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};
