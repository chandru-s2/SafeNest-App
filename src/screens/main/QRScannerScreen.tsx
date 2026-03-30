import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  PermissionsAndroid,
  Platform,
  Vibration,
  Linking,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { MainStackParamList } from '../../navigation/types';

type QRScannerNavigationProp = StackNavigationProp<MainStackParamList, 'QRScanner'>;

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

const QRScannerScreen = () => {
  const navigation = useNavigation<QRScannerNavigationProp>();
  const isFocused = useIsFocused();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [torchOn, setTorchOn] = useState(false);

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkPermission();
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 220,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'SafeNest needs access to your camera to scan QR codes.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      // iOS handling would go here
      setHasPermission(true);
    }
  };

  const handleScan = (qrValue: string) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    Vibration.vibrate(100);

    try {
      const data = JSON.parse(qrValue);
      if (data.type === 'SAFENEST_PAYMENT') {
        navigation.navigate('SendMoney', {
          prefillPhone: data.phone,
          prefillName: data.name,
          prefillUserId: data.userId,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid QR Code',
          text2: 'Please scan a SafeNest QR.',
        });
        setTimeout(() => setIsScanning(true), 2000);
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Invalid QR Code',
        text2: 'Format not recognized.',
      });
      setTimeout(() => setIsScanning(true), 2000);
    }
  };

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="videocam-off" size={64} color="#9CA3AF" />
        <Text style={styles.permissionTitle}>Camera access required</Text>
        <Text style={styles.permissionText}>
          Please allow camera access to scan QR codes
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {isFocused && hasPermission && (
        <Camera
          style={StyleSheet.absoluteFill}
          cameraType={CameraType.Back}
          scanBarcode={isScanning}
          onReadCode={(event) => handleScan(event.nativeEvent.codeStringValue)}
          showFrame={false} // Custom frame below
          torchMode={torchOn ? 'on' : 'off'}
        />
      ) || <View style={styles.cameraPlaceholder} />}

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarButton}>
            <Icon name="arrow-back" size={24} color={COLORS.White} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Scan QR Code</Text>
          <TouchableOpacity 
            onPress={() => setTorchOn(!torchOn)} 
            style={styles.topBarButton}
          >
            <Icon name={torchOn ? "flash-on" : "flash-off"} size={22} color={COLORS.White} />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Area */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
            {/* Viewfinder Corners */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning Line */}
            <Animated.View 
              style={[
                styles.scanLine, 
                { transform: [{ translateY: scanLineAnim }] }
              ]} 
            />
          </View>
          <Text style={styles.hintText}>Point camera at SafeNest QR code</Text>
        </View>

        {/* Bottom Options */}
        <View style={styles.bottomArea}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.manualLink}>Enter UPI ID manually</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    height: 64,
    backgroundColor: 'rgba(10, 25, 49, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  topBarButton: {
    padding: 8,
  },
  topBarTitle: {
    flex: 1,
    color: COLORS.White,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: 220,
    height: 220,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.Teal,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: COLORS.Blue,
    shadowColor: COLORS.Blue,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  hintText: {
    color: COLORS.White,
    marginTop: 24,
    fontSize: 13,
    textAlign: 'center',
  },
  bottomArea: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  manualLink: {
    color: COLORS.White,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.White,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.Navy,
    marginTop: 24,
  },
  permissionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  settingsButton: {
    height: 52,
    backgroundColor: COLORS.Blue,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.White,
    fontSize: 15,
    fontWeight: '500',
  },
  goBackLink: {
    color: COLORS.Blue,
    fontSize: 14,
  },
});

export default QRScannerScreen;
