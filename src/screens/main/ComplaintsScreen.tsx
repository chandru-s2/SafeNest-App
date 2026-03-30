import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { COLORS, RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const ComplaintsScreen = ({ navigation }: any) => {
  const { items } = useSelector((state: RootState) => state.complaints);
  const [activeTab, setActiveTab] = useState('All');
  const dispatch = useDispatch();

  const fetchComplaints = async () => {
    try {
      const api = require('../../services/api').default;
      const { setComplaints, setLoading } = require('../../app/store/slices/complaintsSlice');
      dispatch(setLoading(true));
      const response = await api.get('complaints');
      dispatch(setComplaints(response.data.complaints));
    } catch (error) {
      console.error('Failed to fetch complaints', error);
    } finally {
      const { setLoading } = require('../../app/store/slices/complaintsSlice');
      dispatch(setLoading(false));
    }
  };

  const { useFocusEffect } = require('@react-navigation/native');
  useFocusEffect(
    React.useCallback(() => {
      fetchComplaints();
    }, [])
  );

  const filteredItems = items.filter(
    (item) => activeTab === 'All' || item.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return COLORS.teal;
      case 'Reviewing': return COLORS.amber;
      case 'Escalated': return COLORS.red;
      case 'Resolved': return COLORS.textLight;
      default: return COLORS.blue;
    }
  };

  const ComplaintCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('ComplaintTrack', { id: item.id })}
    >
      <View style={[styles.statusStrip, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.complaintId}>{item.complaintId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.title}>My Complaints</Text>
        <TouchableOpacity 
          style={styles.newBtn} 
          onPress={() => navigation.navigate('ComplaintForm')}
        >
          <Icon name="plus" size={20} color="#FFF" />
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {['All', 'Open', 'Resolved', 'Escalated'].map((tab) => (
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
        data={filteredItems}
        renderItem={({ item }) => <ComplaintCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="check-circle" size={64} color={COLORS.bgGrey} />
            <Text style={styles.emptyText}>No complaints yet. That's a good sign!</Text>
          </View>
        }
      />
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
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  newBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.blue, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  newBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600', marginLeft: 4 },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', padding: 8, gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  activeTab: { backgroundColor: COLORS.blue + '15' },
  tabText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
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
  statusStrip: { width: 4 },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  complaintId: { fontSize: 12, color: COLORS.cyan, fontWeight: '600', fontFamily: 'monospace' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '700' },
  category: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  description: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  timestamp: { fontSize: 11, color: COLORS.textLight, marginTop: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: COLORS.textMuted, fontSize: 15 },
});

export default ComplaintsScreen;
