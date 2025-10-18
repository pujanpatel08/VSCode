import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Card, Button, Searchbar, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { searchPlayers, getPlayerStats } from '../store/slices/playerSlice';
import { addToFavorites } from '../store/slices/favoritesSlice';

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('2023-24');
  const [selectedType, setSelectedType] = useState<'regular' | 'playoffs'>('regular');
  
  const dispatch = useDispatch();
  const { players, loading, error } = useSelector((state: RootState) => state.players);
  const { favorites } = useSelector((state: RootState) => state.favorites);

  const seasons = ['2023-24', '2022-23', '2021-22', '2020-21', '2019-20'];
  const types = [
    { label: 'Regular Season', value: 'regular' },
    { label: 'Playoffs', value: 'playoffs' }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchPlayers(searchQuery));
    }
  };

  const handlePlayerSelect = (player: any) => {
    dispatch(getPlayerStats({ 
      playerId: player.id, 
      season: selectedSeason, 
      type: selectedType 
    }));
  };

  const handleAddToFavorites = (player: any) => {
    dispatch(addToFavorites(player));
    Alert.alert('Success', 'Player added to favorites!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NBA Stats AI</Text>
        <Text style={styles.subtitle}>Ask questions about NBA players and get instant stats</Text>
      </View>

      <Card style={styles.searchCard}>
        <Card.Content>
          <Searchbar
            placeholder="Search for a player..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchbar}
          />
          
          <View style={styles.filters}>
            <Text style={styles.filterLabel}>Season:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {seasons.map((season) => (
                <Chip
                  key={season}
                  selected={selectedSeason === season}
                  onPress={() => setSelectedSeason(season)}
                  style={styles.chip}
                >
                  {season}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filters}>
            <Text style={styles.filterLabel}>Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {types.map((type) => (
                <Chip
                  key={type.value}
                  selected={selectedType === type.value}
                  onPress={() => setSelectedType(type.value as 'regular' | 'playoffs')}
                  style={styles.chip}
                >
                  {type.label}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <Button 
            mode="contained" 
            onPress={handleSearch}
            style={styles.searchButton}
            loading={loading}
          >
            Search Players
          </Button>
        </Card.Content>
      </Card>

      {players.length > 0 && (
        <Card style={styles.resultsCard}>
          <Card.Content>
            <Text style={styles.resultsTitle}>Search Results</Text>
            {players.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerItem}
                onPress={() => handlePlayerSelect(player)}
              >
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.firstname} {player.lastname}</Text>
                  <Text style={styles.playerTeam}>{player.team?.name}</Text>
                </View>
                <Button
                  mode="outlined"
                  onPress={() => handleAddToFavorites(player)}
                  style={styles.favoriteButton}
                >
                  ♥
                </Button>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {favorites.length > 0 && (
        <Card style={styles.favoritesCard}>
          <Card.Content>
            <Text style={styles.favoritesTitle}>Your Favorites</Text>
            {favorites.slice(0, 3).map((player) => (
              <TouchableOpacity
                key={player.id}
                style={styles.favoriteItem}
                onPress={() => handlePlayerSelect(player)}
              >
                <Text style={styles.favoriteName}>{player.firstname} {player.lastname}</Text>
              </TouchableOpacity>
            ))}
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  searchCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  searchbar: {
    backgroundColor: '#2a2a2a',
    marginBottom: 16,
  },
  filters: {
    marginBottom: 16,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  searchButton: {
    marginTop: 8,
  },
  resultsCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  playerTeam: {
    color: '#888',
    fontSize: 14,
  },
  favoriteButton: {
    minWidth: 40,
  },
  favoritesCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  favoritesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  favoriteItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  favoriteName: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
