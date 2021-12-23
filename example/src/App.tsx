import * as React from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<ParamsList>();

import type { ParamsList } from './types';
import Generated from './Generated';
import Home from './Home';
import Preview from './Preview';
import { View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <NativeBaseProvider>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Generated" component={Generated} />
            <Stack.Screen name="Preview" component={Preview} />
          </Stack.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    </View>
  );
}
