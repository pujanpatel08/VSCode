import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Player: {
    player: any;
    season: string;
    type: 'regular' | 'playoffs';
  };
  Query: undefined;
  Favorites: undefined;
};

export type TabParamList = {
  Home: undefined;
  Query: undefined;
  Favorites: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
