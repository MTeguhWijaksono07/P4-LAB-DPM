import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import FutsalScorer from './src/components/FutsalScorer';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <FutsalScorer teamA="LIV" teamB="MNC" />
    </SafeAreaView>
  );
};

export default App;