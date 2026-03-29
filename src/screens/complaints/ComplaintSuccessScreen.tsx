import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const ComplaintSuccessScreen = ({ route, navigation }: any) => {
  const { complaintId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.checkInner}>
          <Icon name="check" size={48} color={COLORS.success} />
        </View>
        <Text style={styles.successTitle}>Complaint filed successfully</Text>
        
        <View style={styles.idBox}>
          <Text style={styles.idText}>{complaintId}</Text>
          <TouchableOpacity>
            <Icon name="copy" size={18} color={COLORS.cyan} />
          </TouchableOpacity>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Received</Text>
        </View>

        <Text style={styles.info}>We will respond within 24 hours.</Text>
      </View>

      <TouchableOpacity 
        style={styles.primaryBtn}
        onPress={() => navigation.navigate('ComplaintTrack', { id: complaintId })}
      >
        <Text style={styles.primaryBtnText}>Track Complaint</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.secondaryBtnText}>Back to home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight, padding: 24, justifyContent: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: 32, alignItems: 'center', ...COLORS.shadow },
  checkInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.success + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 18, fontWeight: '700', color: COLORS.navy, marginBottom: 24 },
  idBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgLight, padding: 12, borderRadius: RADIUS.md, gap: 12, marginBottom: 16 },
  idText: { fontSize: 16, fontWeight: 'bold', color: COLORS.cyan, fontFamily: 'monospace' },
  badge: { backgroundColor: COLORS.teal + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginBottom: 16 },
  badgeText: { color: COLORS.teal, fontSize: 12, fontWeight: '700' },
  info: { fontSize: 13, color: COLORS.textMuted },
  primaryBtn: { backgroundColor: COLORS.blue, height: 52, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { marginTop: 20, alignItems: 'center' },
  secondaryBtnText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '500' },
});

export default ComplaintSuccessScreen;
