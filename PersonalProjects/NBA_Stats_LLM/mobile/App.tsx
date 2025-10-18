import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { PaperProvider } from 'react-native-paper';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import QueryScreen from './src/screens/QueryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

// Types
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1a1a1a',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'NBA Stats AI' }}
            />
            <Stack.Screen 
              name="Player" 
              component={PlayerScreen} 
              options={{ title: 'Player Stats' }}
            />
            <Stack.Screen 
              name="Query" 
              component={QueryScreen} 
              options={{ title: 'AI Query' }}
            />
            <Stack.Screen 
              name="Favorites" 
              component={FavoritesScreen} 
              options={{ title: 'Favorites' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
