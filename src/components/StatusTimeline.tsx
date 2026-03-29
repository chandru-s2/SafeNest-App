import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface Step {
  title: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

interface StatusTimelineProps {
  steps: Step[];
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.leftColumn}>
            <View style={[
              styles.circle, 
              step.status === 'completed' && styles.circleCompleted,
              step.status === 'active' && styles.circleActive
            ]} />
            {index < steps.length - 1 && <View style={[styles.line, step.status === 'completed' && styles.lineCompleted]} />}
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.header}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.timestamp}>{step.timestamp}</Text>
            </View>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingLeft: 4 },
  stepContainer: { flexDirection: 'row', minHeight: 70 },
  leftColumn: { alignItems: 'center', width: 20, marginRight: 16 },
  circle: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.bgGrey, marginTop: 4, zIndex: 1 },
  circleCompleted: { backgroundColor: COLORS.teal },
  circleActive: { backgroundColor: COLORS.amber, borderWidth: 2, borderColor: '#FFF', width: 14, height: 14, borderRadius: 7 },
  line: { width: 2, flex: 1, backgroundColor: COLORS.bgGrey, marginTop: -4, marginBottom: -4 },
  lineCompleted: { backgroundColor: COLORS.teal },
  rightColumn: { flex: 1, paddingBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.navy },
  timestamp: { fontSize: 11, color: COLORS.textLight },
  description: { fontSize: 13, color: COLORS.textMuted },
});

export default StatusTimeline;
