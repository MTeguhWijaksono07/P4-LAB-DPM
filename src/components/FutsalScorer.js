import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Modal } from 'react-native';

const MATCH_DURATION = 1500; // 25 minutes in seconds

const FutsalScorer = () => {
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [teams, setTeams] = useState({ A: "LIV", B: "MNC" });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempTeams, setTempTeams] = useState({ A: "", B: "" });
  const [winner, setWinner] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && time < MATCH_DURATION) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime >= MATCH_DURATION) {
            setIsTimerRunning(false);
            return MATCH_DURATION;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, time]);

  const updateScore = (team, increment) => {
    if (winner) return;
    
    setScores(prev => {
      const newScore = Math.max(0, prev[team] + increment);
      const newScores = { ...prev, [team]: newScore };
      
      if (newScore >= 10) {
        setWinner(teams[team]);
        setShowWinModal(true);
        setIsTimerRunning(false);
      }
      
      return newScores;
    });
  };

  const resetGame = () => {
    setScores({ A: 0, B: 0 });
    setTime(0);
    setIsTimerRunning(false);
    setWinner(null);
    setShowWinModal(false);
  };

  const toggleTimer = () => {
    if (winner) return;
    setIsTimerRunning(!isTimerRunning);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEditTeams = () => {
    setTempTeams(teams);
    setIsEditMode(true);
  };

  const saveTeamNames = () => {
    setTeams(tempTeams);
    setIsEditMode(false);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://www.premierleague.com/resources/rebrand/v7.123.5/i/elements/pl-main-logo.png' }}
        style={styles.plLogo}
      />

      <TouchableOpacity onPress={handleEditTeams} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Teams</Text>
      </TouchableOpacity>

      <View style={styles.scoreContainer}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{teams.A}</Text>
          <Text style={styles.score}>{scores.A}</Text>
          <TouchableOpacity 
            style={[styles.button, styles.addButton, winner && styles.disabledButton]}
            onPress={() => updateScore('A', 1)}
            disabled={!!winner}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.minusButton, winner && styles.disabledButton]}
            onPress={() => updateScore('A', -1)}
            disabled={!!winner}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime()}</Text>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{teams.B}</Text>
          <Text style={styles.score}>{scores.B}</Text>
          <TouchableOpacity 
            style={[styles.button, styles.addButton, winner && styles.disabledButton]}
            onPress={() => updateScore('B', 1)}
            disabled={!!winner}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.minusButton, winner && styles.disabledButton]}
            onPress={() => updateScore('B', -1)}
            disabled={!!winner}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.controlButton, styles.resetButton]}
        onPress={resetGame}
      >
        <Text style={styles.controlButtonText}>RESET</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.controlButton, styles.timerButton, winner && styles.disabledButton]}
        onPress={toggleTimer}
        disabled={!!winner}
      >
        <Text style={styles.controlButtonText}>
          {isTimerRunning ? 'PAUSE' : 'START'}
        </Text>
      </TouchableOpacity>

      {/* Team Edit Modal */}
      <Modal
        visible={isEditMode}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Team Names</Text>
            <TextInput
              style={styles.input}
              value={tempTeams.A}
              onChangeText={(text) => setTempTeams(prev => ({...prev, A: text}))}
              placeholder="Team A Name"
              maxLength={3}
            />
            <TextInput
              style={styles.input}
              value={tempTeams.B}
              onChangeText={(text) => setTempTeams(prev => ({...prev, B: text}))}
              placeholder="Team B Name"
              maxLength={3}
            />
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveTeamNames}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Winner Modal */}
      <Modal
        visible={showWinModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>WINNER!</Text>
            <Text style={styles.modalText}>{winner} Wins! 🏆</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={resetGame}
            >
              <Text style={styles.modalButtonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  plLogo: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  editButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#37003c',
    borderRadius: 5,
    marginBottom: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37003c',
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#37003c',
    marginVertical: 10,
  },
  timeContainer: {
    backgroundColor: '#37003c',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#00ff85',
  },
  minusButton: {
    backgroundColor: '#ff2882',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#37003c',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlButton: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'center',
  },
  resetButton: {
    backgroundColor: '#37003c',
  },
  timerButton: {
    backgroundColor: '#37003c',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#37003c',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37003c',
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#37003c',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#37003c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#37003c',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FutsalScorer;