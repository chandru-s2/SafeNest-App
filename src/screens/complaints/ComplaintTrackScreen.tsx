import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';
import StatusTimeline from '../../components/StatusTimeline';

const ComplaintTrackScreen = ({ route, navigation }: any) => {
  const { id } = route.params;

  const steps: any[] = [
    { title: 'Received', timestamp: 'Mar 16, 14:20', description: 'Complaint lodged successfully', status: 'completed' },
    { title: 'Assigned', timestamp: 'Mar 17, 09:15', description: 'Assigned to nodal officer', status: 'completed' },
    { title: 'Investigation', timestamp: 'Ongoing', description: 'Internal team is reviewing the transaction', status: 'active' },
    { title: 'Resolution', timestamp: '--', description: 'Pending final sign-off', status: 'pending' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Estimated Resolution</Text>
          <Text style={styles.infoValue}>Within 24 hours</Text>
        </View>

        <Text style={styles.sectionHeader}>Status Timeline</Text>
        <View style={styles.timelineContainer}>
          <StatusTimeline steps={steps} />
        </View>

        <View style={styles.escalationNote}>
          <Icon name="info" size={18} color={COLORS.blue} />
          <Text style={styles.escalationText}>
            You can escalate this to Level 2 if not resolved by Mar 18.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  appBar: {
    height: 100,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#FFF', fontFamily: 'monospace' },
  content: { padding: 20 },
  infoCard: { backgroundColor: '#FFF', padding: 20, borderRadius: RADIUS.md, marginBottom: 24, ...COLORS.shadow },
  infoLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '700', color: COLORS.navy },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: COLORS.navy, marginBottom: 16 },
  timelineContainer: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: 20, ...COLORS.shadow },
  escalationNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.blue + '10', padding: 16, borderRadius: RADIUS.md, marginTop: 24, gap: 12 },
  escalationText: { flex: 1, fontSize: 13, color: COLORS.blue, fontWeight: '500' },
});

export default ComplaintTrackScreen;
