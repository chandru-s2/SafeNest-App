import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { toggleChat } from '../app/store/slices/chatSlice';
import { useAdvisor } from '../hooks/useAdvisor';
import { COLORS, RADIUS } from '../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const AdvisorDrawer = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, isTyping } = useSelector((state: RootState) => state.chat);
  const { sendMessage } = useAdvisor('Global');
  const [input, setInput] = React.useState('');
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isOpen ? 0 : 600,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const MessageBubble = ({ item }: any) => (
    <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.bubbleText, item.role === 'user' && { color: '#FFF' }]}>{item.content}</Text>
    </View>
  );

  const QuickReply = ({ text }: { text: string }) => (
    <TouchableOpacity style={styles.replyChip} onPress={() => sendMessage(text)}>
      <Text style={styles.replyText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isOpen} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={() => dispatch(toggleChat(false))} />
        <Animated.View style={[styles.drawer, { transform: [{ translateY: slideAnim }] }]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.handle} />
            
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.iconBox, { backgroundColor: COLORS.teal + '20' }]}>
                  <Icon name="cpu" size={18} color={COLORS.teal} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>SafeNest AI</Text>
                  <View style={styles.statusRow}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.statusText}>Online</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => dispatch(toggleChat(false))}>
                <Icon name="chevron-down" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.chatArea}>
              <FlatList
                data={[...messages].reverse()}
                inverted
                keyExtractor={item => item.id}
                renderItem={({ item }) => <MessageBubble item={item} />}
                contentContainerStyle={styles.messageList}
                ListFooterComponent={
                  messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyTitle}>How can I help you today?</Text>
                      <View style={styles.repliesRow}>
                        <QuickReply text="My balance" />
                        <QuickReply text="Last 5 transactions" />
                        <QuickReply text="Raise a complaint" />
                        <QuickReply text="Fraud help" />
                      </View>
                    </View>
                  ) : null
                }
              />
              
              {isTyping && (
                <View style={styles.typingContainer}>
                  <Text style={styles.typingText}>SafeNest AI is thinking...</Text>
                </View>
              )}
            </View>

            <View style={styles.inputBar}>
              <TextInput
                style={styles.input}
                placeholder="Ask me anything..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Icon name="arrow-up" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  drawer: { height: '75%', backgroundColor: '#FFF', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, ...COLORS.shadow },
  handle: { width: 40, height: 4, backgroundColor: '#E8EDF5', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: '#E8EDF5' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.navy },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  statusText: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
  chatArea: { flex: 1, backgroundColor: COLORS.bgLight },
  messageList: { padding: 16 },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 12 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: COLORS.blue, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },
  typingContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  typingText: { fontSize: 12, color: COLORS.teal, fontStyle: 'italic' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderTopWidth: 0.5, borderTopColor: '#E8EDF5', gap: 12 },
  input: { flex: 1, height: 44, backgroundColor: COLORS.bgGrey, borderRadius: 22, paddingHorizontal: 20, fontSize: 14, color: COLORS.textPrimary },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.blue, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textMuted, marginBottom: 20 },
  repliesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  replyChip: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E8EDF5' },
  replyText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
});

export default AdvisorDrawer;
