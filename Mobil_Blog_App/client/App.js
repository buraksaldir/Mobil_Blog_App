import RootNavigation from './navigation';
import Toast from 'react-native-toast-message';

import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigation />
      <Toast />
    </NavigationContainer>
  );
}
