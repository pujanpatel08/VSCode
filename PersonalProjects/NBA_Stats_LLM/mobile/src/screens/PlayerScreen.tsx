import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getPlayerStats } from '../store/slices/playerSlice';

interface PlayerScreenProps {
  route: {
    params: {
      player: any;
      season: string;
      type: 'regular' | 'playoffs';
    };
  };
}

const PlayerScreen: React.FC<PlayerScreenProps> = ({ route }) => {
  const { player, season, type } = route.params;
  const dispatch = useDispatch();
  const { playerStats, loading, error } = useSelector((state: RootState) => state.players);

  useEffect(() => {
    dispatch(getPlayerStats({ 
      playerId: player.id, 
      season, 
      type 
    }));
  }, [dispatch, player.id, season, type]);

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#1a1a1a',
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#1a1a1a',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading player stats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading stats: {error}</Text>
      </View>
    );
  }

  const stats = playerStats[player.id];
  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No stats available for this player</Text>
      </View>
    );
  }

  const gameData = stats.games?.slice(0, 10) || [];
  const pointsData = gameData.map(game => game.points || 0);
  const reboundsData = gameData.map(game => game.totReb || 0);
  const assistsData = gameData.map(game => game.assists || 0);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.playerCard}>
        <Card.Content>
          <Text style={styles.playerName}>
            {player.firstname} {player.lastname}
          </Text>
          <Text style={styles.playerTeam}>{player.team?.name}</Text>
          <View style={styles.seasonInfo}>
            <Chip style={styles.seasonChip}>{season}</Chip>
            <Chip style={styles.typeChip}>
              {type === 'regular' ? 'Regular Season' : 'Playoffs'}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.statsTitle}>Season Averages</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.points?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totReb?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.statLabel}>Rebounds</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.assists?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.statLabel}>Assists</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.fgp?.toFixed(1) || 'N/A'}%</Text>
              <Text style={styles.statLabel}>FG%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.tpp?.toFixed(1) || 'N/A'}%</Text>
              <Text style={styles.statLabel}>3P%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.ftp?.toFixed(1) || 'N/A'}%</Text>
              <Text style={styles.statLabel}>FT%</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {gameData.length > 0 && (
        <>
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text style={styles.chartTitle}>Last 10 Games - Points</Text>
              <LineChart
                data={{
                  labels: gameData.map((_, index) => `G${index + 1}`),
                  datasets: [
                    {
                      data: pointsData,
                      color: (opacity = 1) => `rgba(255, 167, 38, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card.Content>
          </Card>

          <Card style={styles.chartCard}>
            <Card.Content>
              <Text style={styles.chartTitle}>Last 10 Games - Rebounds & Assists</Text>
              <BarChart
                data={{
                  labels: gameData.map((_, index) => `G${index + 1}`),
                  datasets: [
                    {
                      data: reboundsData,
                    },
                    {
                      data: assistsData,
                    },
                  ],
                }}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
              />
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  playerCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  playerTeam: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  seasonInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  seasonChip: {
    backgroundColor: '#2a2a2a',
  },
  typeChip: {
    backgroundColor: '#2a2a2a',
  },
  statsCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  chartCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default PlayerScreen;
