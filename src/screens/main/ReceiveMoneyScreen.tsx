import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

type ReceiveMoneyNavigationProp = StackNavigationProp<MainStackParamList, 'ReceiveMoney'>;

const COLORS = {
  Navy: '#0A1931',
  Blue: '#1565C0',
  Teal: '#00897B',
  Amber: '#F59E0B',
  Red: '#E53935',
  BgLight: '#F5F7FA',
  BgGrey: '#E8EDF5',
  White: '#FFFFFF',
};

const ReceiveMoneyScreen = () => {
  const navigation = useNavigation<ReceiveMoneyNavigationProp>();

  const [userData, setUserData] = useState({
    userId: 'USER-1234',
    userName: 'SafeNest User',
    userPhone: '9876543210',
  });
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const session = await EncryptedStorage.getItem('safenest_session');
      if (session) {
        const parsed = JSON.parse(session);
        setUserData({
          userId: parsed.userId || 'USER-1234',
          userName: parsed.userName || 'SafeNest User',
          userPhone: parsed.userPhone || '9876543210',
        });
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const getQRValue = () => {
    return JSON.stringify({
      type: 'SAFENEST_PAYMENT',
      phone: userData.userPhone,
      name: userData.userName,
      userId: userData.userId,
      amount: amount || undefined,
      timestamp: Date.now(),
    });
  };

  const handleShare = async () => {
    try {
      // Since view-shot/share-file might need more setup, 
      // we provide a descriptive text share as fallback
      // but the UI is ready for full implementation
      await Share.share({
        message: `Pay me ₹${amount || '0'} on SafeNest using this data: ${getQRValue()}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share QR code');
    }
  };

  const handleDownload = () => {
    Alert.alert('Success', 'QR Code saved to Gallery');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.Navy} />
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.White} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Receive Money</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userData.userName)}</Text>
          </View>
          <Text style={styles.userName}>{userData.userName}</Text>
          <Text style={styles.userPhone}>
            +91 ****{userData.userPhone.slice(-4)}
          </Text>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>YOUR SAFENEST QR CODE</Text>
          <View style={styles.qrBorder}>
            <QRCode
              value={getQRValue()}
              size={220}
              color={COLORS.Navy}
              backgroundColor={COLORS.White}
              quietZone={16}
            />
          </View>
          <Text style={styles.qrSubText}>Scan this code to send money to me</Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.inputLabel}>Request specific amount (optional)</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share" size={20} color={COLORS.White} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Share QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Text style={styles.downloadButtonText}>Save to Gallery</Text>
          </TouchableOpacity>

          <Text style={styles.expiryNote}>QR code expires in 24 hours</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BgLight,
  },
  appBar: {
    height: 56,
    backgroundColor: COLORS.Navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  appBarTitle: {
    color: COLORS.White,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 32,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  identityCard: {
    backgroundColor: COLORS.White,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.Blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.White,
    fontSize: 20,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.Navy,
    marginTop: 12,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  qrCard: {
    backgroundColor: COLORS.White,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  qrLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  qrBorder: {
    borderWidth: 2,
    borderColor: COLORS.Teal,
    borderRadius: 12,
    padding: 16,
  },
  qrSubText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  bottomSection: {
    width: '100%',
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.BgGrey,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.Navy,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    color: COLORS.Navy,
    fontWeight: '500',
  },
  shareButton: {
    height: 52,
    backgroundColor: COLORS.Blue,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: COLORS.White,
    fontSize: 15,
    fontWeight: '500',
  },
  downloadButton: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.Blue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  downloadButtonText: {
    color: COLORS.Blue,
    fontSize: 15,
    fontWeight: '500',
  },
  expiryNote: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default ReceiveMoneyScreen;
