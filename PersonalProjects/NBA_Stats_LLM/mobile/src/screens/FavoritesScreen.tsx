import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromFavorites } from '../store/slices/favoritesSlice';

const FavoritesScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state: RootState) => state.favorites);

  const handleRemoveFavorite = (playerId: string) => {
    dispatch(removeFromFavorites(playerId));
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Add players to your favorites by tapping the heart icon on the home screen
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Favorite Players</Text>
      
      {favorites.map((player) => (
        <Card key={player.id} style={styles.playerCard}>
          <Card.Content>
            <View style={styles.playerInfo}>
              <View style={styles.playerDetails}>
                <Text style={styles.playerName}>
                  {player.firstname} {player.lastname}
                </Text>
                <Text style={styles.playerTeam}>{player.team?.name}</Text>
              </View>
              
              <View style={styles.playerActions}>
                <Button
                  mode="outlined"
                  onPress={() => handleRemoveFavorite(player.id)}
                  style={styles.removeButton}
                  compact
                >
                  Remove
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  emptyCard: {
    backgroundColor: '#1a1a1a',
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  playerCard: {
    backgroundColor: '#1a1a1a',
    marginBottom: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  playerTeam: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  playerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  removeButton: {
    borderColor: '#ff6b6b',
  },
});

export default FavoritesScreen;
