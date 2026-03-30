import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { updateSettings } from '../../app/store/slices/profileSlice';
import { logout } from '../../app/store/slices/authSlice';
import { authService } from '../../services/authService';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';
import { maskAccountNumber } from '../../utils/formatters';
import Icon from 'react-native-vector-icons/Feather';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  const fetchProfile = async () => {
    try {
      const api = require('../../services/api').default;
      const { updateProfile } = require('../../app/store/slices/profileSlice');
      const response = await api.get('/profile');
      dispatch(updateProfile(response.data));
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
  };

  const SettingRow = ({ label, value, onValueChange, isToggle, icon }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.rowLead}>
        <Icon name={icon} size={20} color={COLORS.textMuted} style={{ marginRight: 12 }} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {isToggle ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ true: COLORS.blue }}
        />
      ) : (
        <Icon name="chevron-right" size={20} color={COLORS.textLight} />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name[0]}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.accNo}>{maskAccountNumber(profile.accountNumber)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SECURITY</Text>
        <SettingRow icon="lock" label="Change PIN" />
        <SettingRow 
          icon="shield" 
          label="Biometric login" 
          isToggle 
          value={true} 
        />
        <SettingRow icon="monitor" label="Active sessions" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <SettingRow 
          icon="alert-triangle" 
          label="Fraud alerts" 
          isToggle 
          value={profile.settings.fraudAlerts} 
          onValueChange={(v: boolean) => dispatch(updateSettings({ fraudAlerts: v }))}
        />
        <SettingRow 
          icon="trending-up" 
          label="Spending alerts" 
          isToggle 
          value={profile.settings.spendingAlerts} 
          onValueChange={(v: boolean) => dispatch(updateSettings({ spendingAlerts: v }))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DANGER</Text>
        <TouchableOpacity style={styles.dangerItem} onPress={handleLogout}>
          <Icon name="log-out" size={20} color={COLORS.red} style={{ marginRight: 12 }} />
          <Text style={styles.dangerText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerItem}>
          <Icon name="user-x" size={20} color={COLORS.red} style={{ marginRight: 12 }} />
          <Text style={styles.dangerText}>Deactivate account</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  header: {
    backgroundColor: COLORS.navy,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  name: { fontSize: 22, fontWeight: '600', color: '#FFF' },
  accNo: { fontSize: 13, color: COLORS.blueLight, marginTop: 4 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 12, marginLeft: 4 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  rowLead: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { fontSize: 15, color: COLORS.textPrimary },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  dangerText: { fontSize: 15, color: COLORS.red, fontWeight: '500' },
});

export default ProfileScreen;
