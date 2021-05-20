import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import {Focus} from './features/focus/Focus';
import FocusHistory from './features/focus/FocusHistory';

import {Timer} from './features/timer/Timer';
import {colors} from './utils/colors';
import {spacing} from './utils/sizes';

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2,
};

const App = () => {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubjectWithStatus = (subject, status) => {
    setFocusHistory([
      ...focusHistory,
      {key: String(focusHistory.length + 1), subject, status},
    ]);
  };

  const onClear = () => {
    setFocusHistory([]);
  };

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithStatus(focusSubject, STATUSES.COMPLETE);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addFocusHistorySubjectWithStatus(focusSubject, STATUSES.CANCELLED);

            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{flex: 1}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'ios' ? spacing.lg : spacing.md,
    backgroundColor: colors.darkBlue,
  },
});

export default App;
