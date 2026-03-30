import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  Navy: '#0A1931',
  Blue: '#1565C0',
  Teal: '#00897B',
  Amber: '#F59E0B',
  Red: '#E53935',
  BgLight: '#F5F7FA',
  BgGrey: '#E8EDF5',
  White: '#FFFFFF',
  Purple: '#9C27B0',
};

interface MoreServicesScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ServiceItem = ({ 
  icon, 
  label, 
  color, 
  onPress 
}: { 
  icon: string; 
  label: string; 
  color: string; 
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.serviceItem} onPress={onPress}>
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      <Icon name={icon} size={24} color={COLORS.White} />
    </View>
    <Text style={styles.serviceLabel} numberOfLines={2}>{label}</Text>
  </TouchableOpacity>
);

const MoreServicesScreen: React.FC<MoreServicesScreenProps> = ({ visible, onClose }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const showSoon = (service: string) => {
    Toast.show({
      type: 'info',
      text1: `${service} — Coming Soon`,
      position: 'bottom',
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View 
          style={[
            styles.sheet, 
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.handleBar} />
          
          <View style={styles.header}>
            <Text style={styles.title}>More Services</Text>
          </View>

          <ScrollView contentContainerStyle={styles.grid}>
            {/* Row 1 */}
            <ServiceItem 
              icon="phone-android" 
              label="Mobile Recharge" 
              color={COLORS.Blue} 
              onPress={() => showSoon('Mobile Recharge')} 
            />
            <ServiceItem 
              icon="bolt" 
              label="Electricity Bill" 
              color={COLORS.Amber} 
              onPress={() => showSoon('Electricity Bill')} 
            />
            <ServiceItem 
              icon="water-drop" 
              label="Water Bill" 
              color={COLORS.Teal} 
              onPress={() => showSoon('Water Bill')} 
            />

            {/* Row 2 */}
            <ServiceItem 
              icon="wifi" 
              label="WiFi / Broadband" 
              color={COLORS.Blue} 
              onPress={() => showSoon('WiFi Bill')} 
            />
            <ServiceItem 
              icon="tv" 
              label="DTH / Cable TV" 
              color={COLORS.Purple} 
              onPress={() => showSoon('DTH Recharge')} 
            />
            <ServiceItem 
              icon="play-circle" 
              label="OTT Subscription" 
              color={COLORS.Red} 
              onPress={() => showSoon('OTT')} 
            />

            {/* Row 3 */}
            <ServiceItem 
              icon="directions-transit" 
              label="Metro / Bus Pass" 
              color={COLORS.Teal} 
              onPress={() => showSoon('Transit')} 
            />
            <ServiceItem 
              icon="directions-car" 
              label="FASTag Recharge" 
              color={COLORS.Amber} 
              onPress={() => showSoon('FASTag')} 
            />
            <ServiceItem 
              icon="shield" 
              label="Insurance Premium" 
              color={COLORS.Blue} 
              onPress={() => showSoon('Insurance')} 
            />

            {/* Row 4 */}
            <ServiceItem 
              icon="account-balance" 
              label="Loan EMI" 
              color={COLORS.Navy} 
              onPress={() => showSoon('Loan EMI')} 
            />
            <ServiceItem 
              icon="school" 
              label="Education Fee" 
              color={COLORS.Teal} 
              onPress={() => showSoon('Education')} 
            />
            <ServiceItem 
              icon="trending-up" 
              label="Mutual Fund SIP" 
              color={COLORS.Amber} 
              onPress={() => showSoon('SIP')} 
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: COLORS.White,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 480, // Slightly more to avoid clipping
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.BgGrey,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.Navy,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  serviceItem: {
    width: '30%',
    height: 100,
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 11,
    color: COLORS.Navy,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 8,
  },
  closeButton: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.Blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: COLORS.Blue,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MoreServicesScreen;
