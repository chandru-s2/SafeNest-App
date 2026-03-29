import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import Icon from 'react-native-vector-icons/Feather';
import CaptchaGate from './CaptchaGate';

const FraudAlertModal = ({ onClose }: { onClose: () => void }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const handleBlock = () => {
    setIsBlocked(true);
  };

  const flaggedTxns = [
    { id: '1', merchant: 'Unknown Merchant', amount: '₹12,499', time: '2 mins ago' },
    { id: '2', merchant: 'Intl Transfer', amount: '₹45,000', time: '5 mins ago' },
  ];

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Suspicious activity detected</Text>
          </View>

          {!isBlocked ? (
            <View style={styles.content}>
              <Text style={styles.info}>SafeNest AI has flagged these transactions as high-risk:</Text>
              
              <FlatList
                data={flaggedTxns}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.txnCard}>
                    <View>
                      <Text style={styles.merchant}>{item.merchant}</Text>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={styles.amount}>{item.amount}</Text>
                  </View>
                )}
              />

              <View style={styles.recommendation}>
                <Icon name="info" size={18} color={COLORS.amber} />
                <Text style={styles.recommendationText}>
                  SafeNest AI recommends: Block card immediately and set lower transfer limits.
                </Text>
              </View>

              <CaptchaGate trigger="card_block" onVerified={handleBlock}>
                <View style={styles.blockBtn}>
                  <Text style={styles.blockText}>Block my card</Text>
                </View>
              </CaptchaGate>

              <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
                <Text style={styles.dismissText}>This was me — dismiss</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.content}>
              <View style={styles.successIcon}>
                <Icon name="shield-off" size={64} color={COLORS.red} />
              </View>
              <Text style={styles.successTitle}>Card Blocked</Text>
              <Text style={styles.successSub}>Your card has been deactivated. A replacement is being processed.</Text>
              
              <View style={styles.complaintBox}>
                <Text style={styles.complaintId}>SNT-2025-FRAUD-9912</Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Back to safety</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  container: { backgroundColor: '#FFF', borderRadius: RADIUS.xl, overflow: 'hidden' },
  header: { backgroundColor: COLORS.red, padding: 20, alignItems: 'center' },
  headerText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  content: { padding: 24 },
  info: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },
  txnCard: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.bgLight, borderRadius: RADIUS.md, marginBottom: 12 },
  merchant: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  time: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  amount: { fontSize: 14, fontWeight: '700', color: COLORS.red },
  recommendation: { flexDirection: 'row', backgroundColor: '#FFF8E1', padding: 16, borderRadius: RADIUS.md, borderLeftWidth: 4, borderLeftColor: COLORS.amber, marginBottom: 24, gap: 12 },
  recommendationText: { flex: 1, fontSize: 13, color: '#92400E', fontWeight: '500' },
  blockBtn: { backgroundColor: COLORS.red, height: 52, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
  blockText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dismissBtn: { marginTop: 16, height: 52, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDD' },
  dismissText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '500' },
  successIcon: { alignSelf: 'center', width: 100, height: 100, backgroundColor: COLORS.red + '10', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.navy, textAlign: 'center', marginBottom: 12 },
  successSub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  complaintBox: { backgroundColor: COLORS.bgLight, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'center', marginTop: 24 },
  complaintId: { color: COLORS.cyan, fontSize: 13, fontWeight: '700', fontFamily: 'monospace' },
  closeBtn: { backgroundColor: COLORS.navy, height: 52, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  closeText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default FraudAlertModal;
