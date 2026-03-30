import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';
import StatusTimeline from '../../components/StatusTimeline';

const ComplaintTrackScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const [loading, setLoading] = React.useState(true);
  const [complaintData, setComplaintData] = React.useState<any>(null);

  const fetchTracking = async () => {
    try {
      const api = require('../../services/api').default;
      const response = await api.get(`/complaints/${id}`);
      setComplaintData(response.data);
    } catch (error) {
      console.error('Failed to fetch tracking', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTracking();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </View>
    );
  }

  const steps = complaintData?.timeline || [
    { title: 'Received', timestamp: '...', description: 'Complaint lodged successfully', status: 'completed' },
    { title: 'Assigned', timestamp: '...', description: 'Assigned to nodal officer', status: 'pending' },
    { title: 'Investigation', timestamp: '--', description: 'Internal team is reviewing', status: 'pending' },
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
