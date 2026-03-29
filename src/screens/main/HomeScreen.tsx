import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';
import Icon from 'react-native-vector-icons/Feather';
import TransactionItem from '../../components/TransactionItem';
import OfflineBanner from '../../components/OfflineBanner';

const HomeScreen = () => {
  const { balance, transactions, isOffline } = useSelector((state: RootState) => state.dashboard);
  const { name } = useSelector((state: RootState) => state.profile);
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const ActionButton = ({ icon, label }: any) => (
    <TouchableOpacity style={styles.actionBtn}>
      <View style={styles.actionIcon}>
        <Icon name={icon} size={20} color={COLORS.blue} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  function alert(arg0: string) {
    throw new Error('Function not implemented.');
  }

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
              <ActionButton icon="send" label="Send" onPress={() => alert('Send')} />
              <ActionButton icon="download" label="Receive" />
              <ActionButton icon="credit-card" label="Pay Bills" />
              <ActionButton icon="grid" label="More" />
            </View>

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
  actionBtn: { alignItems: 'center' },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...COLORS.shadow,
  },
  actionLabel: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '500' },
  sectionHeader: { fontSize: 16, fontWeight: '600', color: COLORS.navy, marginHorizontal: 16, marginBottom: 12 },
  listContent: { paddingBottom: 100 },
});

export default HomeScreen;
