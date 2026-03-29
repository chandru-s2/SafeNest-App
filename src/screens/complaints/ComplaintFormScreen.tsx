import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { addComplaint } from '../../app/store/slices/complaintsSlice';
import { COLORS, RADIUS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import CaptchaGate from '../../components/CaptchaGate';
import Toast from 'react-native-toast-message';

const ComplaintFormScreen = ({ navigation }: any) => {
  const [category, setCategory] = useState('Transaction');
  const [description, setDescription] = useState('');
  const [refId, setRefId] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  const dispatch = useDispatch();

  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
      setAttachment(res[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) console.log(err);
    }
  };

  const handleSubmit = () => {
    const newComplaint = {
      id: Math.random().toString(),
      complaintId: `SNT-2025-MUM-${Math.floor(100000 + Math.random() * 900000)}`,
      category,
      description,
      status: 'Open' as const,
      timestamp: new Date().toLocaleString(),
    };
    dispatch(addComplaint(newComplaint));
    navigation.navigate('ComplaintSuccess', { complaintId: newComplaint.complaintId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Raise a Complaint</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          {['Transaction', 'Fraud', 'Service', 'Other'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.catBtn, category === cat && styles.activeCat]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, category === cat && styles.activeCatText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Describe your issue</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Please provide details..."
          value={description}
          onChangeText={setDescription}
          maxLength={500}
        />
        <Text style={styles.counter}>{description.length}/500</Text>

        <Text style={styles.label}>Transaction ID (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. TXN12345678"
          value={refId}
          onChangeText={setRefId}
        />

        <TouchableOpacity style={styles.fileBtn} onPress={handlePickFile}>
          <Icon name="paperclip" size={18} color={COLORS.blue} />
          <Text style={styles.fileBtnText}>
            {attachment ? attachment.name : 'Attach screenshot'}
          </Text>
        </TouchableOpacity>

        <CaptchaGate trigger="complaint_submit" onVerified={handleSubmit}>
          <View style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit Complaint</Text>
          </View>
        </CaptchaGate>
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
  title: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.navy, marginBottom: 8, marginTop: 16 },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E8EDF5' },
  activeCat: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  catText: { fontSize: 13, color: COLORS.textMuted },
  activeCatText: { color: '#FFF', fontWeight: '600' },
  textArea: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: 16, height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E8EDF5' },
  counter: { textAlign: 'right', fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  input: { backgroundColor: '#FFF', borderRadius: RADIUS.md, padding: 16, borderWidth: 1, borderColor: '#E8EDF5' },
  fileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: RADIUS.md, marginTop: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.blue },
  fileBtnText: { marginLeft: 8, color: COLORS.blue, fontSize: 14, fontWeight: '500' },
  submitBtn: { backgroundColor: COLORS.blue, height: 52, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default ComplaintFormScreen;
