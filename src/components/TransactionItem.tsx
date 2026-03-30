import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/formatters';
import Icon from 'react-native-vector-icons/Feather';

interface TransactionItemProps {
  item: {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    merchant: string;
    ts: string;
    status: string;
    category?: string;
    referenceId?: string;
  };
}

const getCategoryIcon = (category?: string, type?: string) => {
  if (type === 'credit') return 'arrow-down-left';
  switch (category) {
    case 'Food': return 'coffee';
    case 'Shopping': return 'shopping-bag';
    case 'Transfer': return 'send';
    case 'Bills': return 'file-text';
    case 'ATM': return 'credit-card';
    case 'Medical': return 'activity';
    case 'Travel': return 'navigation';
    case 'Entertainment': return 'film';
    default: return 'shopping-cart';
  }
};

const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
  const isDebit = item.type === 'debit';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.iconBox, { backgroundColor: isDebit ? COLORS.bgGrey : COLORS.blue + '10' }]}>
          <Icon name={getCategoryIcon(item.category, item.type)} size={20} color={isDebit ? COLORS.textPrimary : COLORS.blue} />
        </View>
        <View>
          <Text style={styles.merchant}>{item.merchant}</Text>
          <Text style={styles.date}>{formatDate(item.ts)}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isDebit ? COLORS.textPrimary : COLORS.success }]}>
          {isDebit ? '-' : '+'}{formatCurrency(item.amount)}
        </Text>
        <Text style={[
          styles.status,
          item.status === 'failed' && { color: '#E53935' },
          item.status === 'pending' && { color: '#F59E0B' },
          item.status === 'completed' && { color: '#4CAF50' }
        ]}>{item.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8EDF5',
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  merchant: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  date: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontWeight: '700' },
  status: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
});

export default TransactionItem;
