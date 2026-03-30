import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';
import Icon from 'react-native-vector-icons/Feather';
import TransactionItem from '../../components/TransactionItem';
import OfflineBanner from '../../components/OfflineBanner';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MoreServicesScreen from './MoreServicesScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

const NEW_COLORS = {
  Navy: '#0A1931',
  Blue: '#1565C0',
  Teal: '#00897B',
  Amber: '#F59E0B',
  BgLight: '#F5F7FA',
  White: '#FFFFFF',
};

const HomeScreen = () => {
  const { balance, transactions, isOffline } = useSelector((state: RootState) => state.dashboard);
  const { name } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const { authToken } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const fetchDashboard = async () => {
    try {
      const api = require('../../services/api').default;
      const { setBalance, setTransactions } = require('../../app/store/slices/dashboardSlice');
      const response = await api.get('dashboard');
      dispatch(setBalance(response.data.balance));
      dispatch(setTransactions(response.data.transactions));
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    }
  };

  React.useEffect(() => {
    if (authToken) {
      fetchDashboard();
    }
  }, [authToken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  const QuickActionButton = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <View style={[styles.actionIconCircle, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.greeting}>Good morning, {name}</Text>
        <TouchableOpacity style={styles.notification}>
          <Icon name="bell" size={24} color="#FFF" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {isOffline && <OfflineBanner />}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListHeaderComponent={
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <View style={styles.amountRow}>
                <Text style={styles.amount}>
                  {showBalance ? formatCurrency(balance.savings + balance.current) : '₹ ••••••'}
                </Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                  <Icon name={showBalance ? "eye" : "eye-off"} size={20} color={COLORS.blueLight} />
                </TouchableOpacity>
              </View>
              <View style={styles.splitRow}>
                <Text style={styles.splitText}>Savings: {showBalance ? formatCurrency(balance.savings) : '₹ •••'}</Text>
                <View style={styles.divider} />
                <Text style={styles.splitText}>Current: {showBalance ? formatCurrency(balance.current) : '₹ •••'}</Text>
              </View>
            </View>

            <View style={styles.actionsGrid}>
              <QuickActionButton 
                icon="send" 
                label="Send" 
                color={NEW_COLORS.Blue} 
                onPress={() => navigation.navigate('SendMoney')} 
              />
              <QuickActionButton 
                icon="call-received" 
                label="Receive" 
                color={NEW_COLORS.Teal} 
                onPress={() => navigation.navigate('ReceiveMoney')} 
              />
              <QuickActionButton 
                icon="qr-code-scanner" 
                label="Scan QR" 
                color={NEW_COLORS.Amber} 
                onPress={() => navigation.navigate('QRScanner')} 
              />
              <QuickActionButton 
                icon="apps" 
                label="More" 
                color={NEW_COLORS.Navy} 
                onPress={() => setMoreSheetVisible(true)} 
              />
            </View>

            <MoreServicesScreen 
              visible={moreSheetVisible} 
              onClose={() => setMoreSheetVisible(false)} 
            />

            <Text style={styles.sectionHeader}>Recent activity</Text>
          </>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  greeting: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  notification: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.amber,
  },
  balanceCard: {
    backgroundColor: COLORS.blue,
    margin: 16,
    padding: 20,
    borderRadius: RADIUS.xl,
    ...COLORS.shadow,
  },
  balanceLabel: { color: COLORS.blueLight, fontSize: 12, marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  amount: { color: '#FFF', fontSize: 32, fontWeight: '600' },
  splitRow: { flexDirection: 'row', alignItems: 'center', opacity: 0.9 },
  splitText: { color: '#FFF', fontSize: 13 },
  divider: { width: 1, height: 12, backgroundColor: '#FFF', marginHorizontal: 12, opacity: 0.3 },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionBtn: { flex: 1, alignItems: 'center' },
  actionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...COLORS.shadow,
  },
  actionLabel: { fontSize: 11, color: COLORS.navy, fontWeight: '500' },
  sectionHeader: { fontSize: 16, fontWeight: '600', color: COLORS.navy, marginHorizontal: 16, marginBottom: 12 },
  listContent: { paddingBottom: 100 },
});

export default HomeScreen;
