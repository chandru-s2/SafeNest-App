import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

type StripePaymentNavigationProp = StackNavigationProp<MainStackParamList, 'StripePayment'>;
type StripePaymentRouteProp = RouteProp<MainStackParamList, 'StripePayment'>;

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

const StripePaymentScreen = () => {
  const navigation = useNavigation<StripePaymentNavigationProp>();
  const route = useRoute<StripePaymentRouteProp>();
  const { recipientPhone, amount, recipientName } = route.params;

  const [webViewLoading, setWebViewLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [txnId] = useState(`TXN${Date.now()}`);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const buildStripeUrl = (amt: string, phone: string): string => {
    const amountInPaise = Math.round(parseFloat(amt) * 100);
    return `https://checkout.stripe.com/c/pay/test#` +
      `amount=${amountInPaise}` +
      `&currency=inr` +
      `&description=SafeNest+Transfer+to+${phone}`;
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    if (url.includes('success') || url.includes('return_url') || url.includes('complete')) {
      handlePaymentSuccess();
    } else if (url.includes('cancel') || url.includes('failed')) {
      setPaymentStatus('failed');
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();
  };

  if (paymentStatus === 'success') {
    return (
      <SafeAreaView style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.BgLight} />
        <View style={styles.successContent}>
          <Animated.View style={[styles.successIconOuter, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.successIconInner}>
              <Icon name="check" size={40} color={COLORS.White} />
            </View>
          </Animated.View>
          
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successDetail}>
            ₹{amount} sent to {recipientName}
          </Text>
          
          <View style={styles.txnCard}>
            <View style={styles.txnRow}>
              <Text style={styles.txnLabel}>Reference ID</Text>
              <Text style={styles.txnValue}>{txnId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.txnRow}>
              <Text style={styles.txnLabel}>Timestamp</Text>
              <Text style={styles.txnDate}>{new Date().toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as any }],
              })}
            >
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('SendMoney')}
            >
              <Text style={styles.secondaryButtonText}>Send Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.BgLight} />
        <View style={styles.successContent}>
          <View style={[styles.successIconOuter, { backgroundColor: '#FFEBEE' }]}>
            <View style={[styles.successIconInner, { backgroundColor: COLORS.Red }]}>
              <Icon name="close" size={40} color={COLORS.White} />
            </View>
          </View>
          
          <Text style={[styles.successTitle, { color: COLORS.Red }]}>Payment Failed</Text>
          <Text style={styles.errorDetail}>Your money has not been debited</Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SendMoney')}
            >
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.textButton}
              onPress={() => navigation.navigate('Home' as any)}
            >
              <Text style={styles.textButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.Navy} />
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.White} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Secure Payment</Text>
        <Icon name="lock" size={16} color={COLORS.White} style={styles.lockIcon} />
      </View>

      {webViewLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.Teal} />
          <Text style={styles.loadingText}>Connecting to Stripe...</Text>
        </View>
      )}

      <WebView
        source={{ uri: buildStripeUrl(amount, recipientPhone) }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        onLoadStart={() => setWebViewLoading(true)}
        onLoadEnd={() => setWebViewLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Navy,
  },
  webview: {
    flex: 1,
  },
  appBar: {
    height: 56,
    backgroundColor: COLORS.Navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
  },
  appBarTitle: {
    color: COLORS.White,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  lockIcon: {
    width: 40,
    textAlign: 'right',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.Navy,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: COLORS.White,
    marginTop: 12,
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    backgroundColor: COLORS.BgLight,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.BgLight,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.Teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.Teal,
    marginBottom: 8,
  },
  successDetail: {
    fontSize: 16,
    color: COLORS.Navy,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorDetail: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  txnCard: {
    backgroundColor: COLORS.White,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  txnRow: {
    marginBottom: 12,
  },
  txnLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  txnValue: {
    fontSize: 14,
    color: '#00BCD4',
    fontFamily: 'monospace',
  },
  txnDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BgGrey,
    marginVertical: 12,
  },
  buttonGroup: {
    width: '100%',
  },
  primaryButton: {
    height: 52,
    backgroundColor: COLORS.Blue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.White,
    fontSize: 15,
    fontWeight: '500',
  },
  secondaryButton: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.Blue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.Blue,
    fontSize: 15,
    fontWeight: '500',
  },
  textButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonText: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default StripePaymentScreen;
