import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview'; // Assuming it's available or should be installed
import { captchaService } from '../services/captchaService';
import Toast from 'react-native-toast-message';

interface CaptchaGateProps {
  trigger: string;
  onVerified: () => void;
  children: React.ReactNode;
}

const CaptchaGate: React.FC<CaptchaGateProps> = ({ trigger, onVerified, children }) => {
  const [showModal, setShowModal] = useState(false);

  const handlePress = () => {
    if (captchaService.isTokenValid()) {
      onVerified();
    } else {
      setShowModal(true);
    }
  };

  const onMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'verified') {
      captchaService.setToken(data.token, 60);
      setShowModal(false);
      onVerified();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <WebView
              source={{ uri: 'https://hcaptcha.com/demo' }} // Placeholder for actual hCaptcha widget
              onMessage={onMessage}
              style={{ flex: 1 }}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { height: 400, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  closeBtn: { position: 'absolute', top: 10, right: 10, width: 30, height: 30 },
});

export default CaptchaGate;
