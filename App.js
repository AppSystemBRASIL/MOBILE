import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/Home';
import MeusSeguros from './src/screens/MeusSeguros';
import InfoSeguro from './src/screens/MeusSeguros/infoSeguro';
import FacaSeuSeguro from './src/screens/FacaSeuSeguro';
import FormSeguro from './src/screens/FacaSeuSeguro/formSeguro';
import LeituraObrigatoria from './src/screens/LeituraObrigatoria';
import ComoProceder from './src/screens/ComoProceder';
import FinanciarVeiculo from './src/screens/FinanciarVeiculo';
import ContatosUteis from './src/screens/ContatosUteis';
import ContatoCorretor from './src/screens/ContatoCorretor';
import ContatoCorretora from './src/screens/ContatoCorretora';
import ContatosInformativos from './src/screens/ContatosInformativos';
import ComoProcederInfoContent from './src/screens/ComoProceder/infoContent';
import PontosMultas from './src/screens/PontosMultas';
import ContatosItens from './src/screens/ContatosItens';
import ContatosSeguradoras from './src/screens/ContatosSeguradoras';

import { NativeBaseProvider } from 'native-base';
import { ContextProvider } from './src/context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ContextProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='home'>
            <Stack.Screen name='home' component={HomeScreen} />
            <Stack.Screen name='meusSeguros' component={MeusSeguros} />
            <Stack.Screen name='infoSeguro' component={InfoSeguro} />
            <Stack.Screen name='facaSeuSeguro' component={FacaSeuSeguro} />
            <Stack.Screen name='formSeguro' component={FormSeguro} />
            <Stack.Screen name='leituraObrigatoria' component={LeituraObrigatoria} />
            <Stack.Screen name='comoProceder' component={ComoProceder} />
            <Stack.Screen name='comoProcederInfoContent' component={ComoProcederInfoContent} />
            <Stack.Screen name='financiarVeiculo' component={FinanciarVeiculo} />
            <Stack.Screen name='contatosUteis' component={ContatosUteis} />
            <Stack.Screen name='contatoCorretor' component={ContatoCorretor} />
            <Stack.Screen name='contatoCorretora' component={ContatoCorretora} />
            <Stack.Screen name='contatosInformativos' component={ContatosInformativos} />
            <Stack.Screen name='pontosMultas' component={PontosMultas} />
            <Stack.Screen name='contatosItens' component={ContatosItens} />
            <Stack.Screen name='contatosSeguradoras' component={ContatosSeguradoras} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </ContextProvider>
  );
}