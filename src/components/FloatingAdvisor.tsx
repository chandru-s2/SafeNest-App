import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { toggleChat } from '../app/store/slices/chatSlice';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../constants/theme';
import AdvisorDrawer from './AdvisorDrawer';

const FloatingAdvisor = () => {
  const dispatch = useDispatch();
  const { unreadCount, isOpen } = useSelector((state: RootState) => state.chat);
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );
    if (!isOpen) pulse.start();
    else pulse.stop();
    return () => pulse.stop();
  }, [isOpen]);

  return (
    <>
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ scale: pulseAnim }], display: isOpen ? 'none' : 'flex' }
        ]}
      >
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => dispatch(toggleChat(true))}
          activeOpacity={0.9}
        >
          <Icon name="message-circle" size={28} color="#FFF" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <AdvisorDrawer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.teal,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.teal,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.red,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});

export default FloatingAdvisor;
