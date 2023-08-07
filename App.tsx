import React, {useState} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import AppStack from './src/navigations/AppRoutes';
const App = () => {
return(
  <NavigationContainer>
    <AppStack/>
  </NavigationContainer>
)
};

export default App;