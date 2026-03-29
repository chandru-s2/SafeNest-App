import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const SettingsScreen = ({ navigation }: any) => {
  const SettingItem = ({ label, icon, onPress }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.inner}>
        <Icon name={icon} size={20} color={COLORS.textMuted} style={{ marginRight: 16 }} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem icon="user" label="Personal Information" />
        <SettingItem icon="credit-card" label="Manage Cards" />
        <SettingItem icon="file-text" label="Statement Preferences" />

        <Text style={styles.sectionTitle}>Security</Text>
        <SettingItem icon="shield" label="Security Center" />
        <SettingItem icon="eye-off" label="Privacy Settings" />

        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem icon="help-circle" label="Help & Support" />
        <SettingItem icon="info" label="About SafeNest" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  header: {
    height: 100,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginTop: 24, marginBottom: 12, marginLeft: 4, letterSpacing: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  inner: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
});

export default SettingsScreen;
