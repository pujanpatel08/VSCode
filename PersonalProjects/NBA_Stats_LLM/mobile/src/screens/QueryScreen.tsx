import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Card, Button, TextInput as PaperTextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { processAIQuery } from '../store/slices/aiSlice';

const QueryScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { response, loading, error } = useSelector((state: RootState) => state.ai);

  const handleSubmitQuery = () => {
    if (query.trim()) {
      dispatch(processAIQuery(query));
    } else {
      Alert.alert('Error', 'Please enter a question');
    }
  };

  const exampleQueries = [
    "What were LeBron James' stats in the 2023 playoffs?",
    "How many points did Stephen Curry average in the 2022-23 regular season?",
    "Show me Nikola Jokic's playoff stats for 2023",
    "What was Kevin Durant's shooting percentage in the 2023 playoffs?",
    "Compare Luka Doncic's regular season vs playoff stats for 2023"
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.queryCard}>
        <Card.Content>
          <Text style={styles.title}>Ask AI About NBA Stats</Text>
          <Text style={styles.subtitle}>
            Ask natural language questions about NBA players and their statistics
          </Text>
          
          <PaperTextInput
            label="Your question"
            value={query}
            onChangeText={setQuery}
            multiline
            numberOfLines={3}
            style={styles.textInput}
            placeholder="e.g., What were LeBron James' stats in the 2023 playoffs?"
          />
          
          <Button
            mode="contained"
            onPress={handleSubmitQuery}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Ask AI
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.examplesCard}>
        <Card.Content>
          <Text style={styles.examplesTitle}>Example Questions</Text>
          {exampleQueries.map((example, index) => (
            <Button
              key={index}
              mode="outlined"
              onPress={() => setQuery(example)}
              style={styles.exampleButton}
              compact
            >
              {example}
            </Button>
          ))}
        </Card.Content>
      </Card>

      {response && (
        <Card style={styles.responseCard}>
          <Card.Content>
            <Text style={styles.responseTitle}>AI Response</Text>
            <Text style={styles.responseText}>{response}</Text>
          </Card.Content>
        </Card>
      )}

      {error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorText}>Error: {error}</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  queryCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  examplesCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  exampleButton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  responseCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  responseText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  errorCard: {
    margin: 16,
    backgroundColor: '#2a1a1a',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
});

export default QueryScreen;
