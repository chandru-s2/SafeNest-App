import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

interface PinPadProps {
  onNumberPress: (digit: string) => void;
  onBackspace: () => void;
}

const PinPad: React.FC<PinPadProps> = ({ onNumberPress, onBackspace }) => {
  const numbers = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'backspace']];

  return (
    <View style={styles.container}>
      {numbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, itemIndex) => {
            if (item === '') return <View key={itemIndex} style={styles.buttonEmpty} />;
            if (item === 'backspace') {
              return (
                <TouchableOpacity key={itemIndex} style={styles.button} onPress={onBackspace}>
                  <Icon name="delete" size={24} color="#FFF" />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity key={itemIndex} style={styles.button} onPress={() => onNumberPress(item)}>
                <Text style={styles.buttonText}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.card,
  },
  buttonEmpty: { width: 64, height: 64 },
  buttonText: { color: '#FFF', fontSize: 22, fontWeight: '600' },
});

export default PinPad;
