import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { COLORS, RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';
import FraudAlertModal from '../../components/FraudAlertModal';

const AlertsScreen = () => {
  const { items, riskScore, lastAnalyzed } = useSelector((state: RootState) => state.alerts);
  const [activeTab, setActiveTab] = useState('All');
  const [showFraudModal, setShowFraudModal] = useState(riskScore > 70);
  const dispatch = require('react-redux').useDispatch();

  const fetchAlerts = async () => {
    try {
      const api = require('../../services/api').default;
      const { setAlerts, setRiskScore } = require('../../app/store/slices/alertsSlice');
      const response = await api.get('alerts');
      console.log('DEBUG: Alerts Response:', JSON.stringify(response.data.items));
      dispatch(setAlerts(response.data.items));
      dispatch(setRiskScore(response.data.riskScore));
    } catch (error) {
      console.error('Failed to fetch alerts', error);
    }
  };

  React.useEffect(() => {
    fetchAlerts();
  }, []);

  const getRiskColor = (score: number) => {
    if (score < 40) return COLORS.teal;
    if (score < 71) return COLORS.amber;
    return COLORS.red;
  };

  const AlertCard = ({ item }: any) => (
    <View style={[styles.card, !item.read && styles.unreadCard]}>
      <View style={[styles.severityStrip, { backgroundColor: getRiskColor(item.severity === 'high' ? 80 : item.severity === 'medium' ? 50 : 20) }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.alertType}>{item.type}</Text>
          <Text style={styles.alertTime}>{item.ts}</Text>
        </View>
        <Text style={styles.alertMsg}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Security Alerts</Text>
      </View>

      <View style={styles.riskCard}>
        <View>
          <Text style={styles.riskLabel}>Your risk score</Text>
          <Text style={[styles.riskScore, { color: getRiskColor(riskScore) }]}>{riskScore}</Text>
          <Text style={styles.riskSub}>Last analyzed: {new Date(lastAnalyzed).getHours()} hours ago</Text>
        </View>
        <View style={[styles.riskCircle, { borderColor: getRiskColor(riskScore) }]}>
          <Icon name="shield" size={32} color={getRiskColor(riskScore)} />
        </View>
      </View>

      <View style={styles.tabBar}>
        {['All', 'Fraud', 'Spending', 'Tips'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items.filter(i => activeTab === 'All' || i.type === activeTab)}
        renderItem={({ item }) => <AlertCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {showFraudModal && <FraudAlertModal onClose={() => setShowFraudModal(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  appBar: {
    height: 100,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  riskCard: {
    backgroundColor: COLORS.navy,
    margin: 16,
    padding: 24,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskLabel: { color: COLORS.blueLight, fontSize: 12, fontWeight: '600' },
  riskScore: { fontSize: 36, fontWeight: 'bold', marginVertical: 4 },
  riskSub: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  riskCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', padding: 8, gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  activeTab: { backgroundColor: COLORS.blue + '15' },
  tabText: { fontSize: 13, color: COLORS.textMuted },
  activeTabText: { color: COLORS.blue, fontWeight: '600' },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: RADIUS.md,
    marginBottom: 12,
    overflow: 'hidden',
    ...COLORS.shadow,
  },
  unreadCard: { backgroundColor: '#F0F4FF' },
  severityStrip: { width: 4 },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  alertType: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  alertTime: { fontSize: 11, color: COLORS.textLight },
  alertMsg: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },
});

export default AlertsScreen;
