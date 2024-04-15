import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Pokemon } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

function team() {
const [capturedPokemons, setCapturedPokemons] = useState([]);

useEffect(() => {
    const fetchStoredPokemons = async () => {
        const storedPokemons = JSON.parse(await AsyncStorage.getItem('capturedPokemons') || '[]');
        setCapturedPokemons(storedPokemons);
    };

    fetchStoredPokemons();
}, []);

const releasePokemon = (index: number) => {
    const newCapturedPokemons = [...capturedPokemons];
    newCapturedPokemons.splice(index, 1);
    setCapturedPokemons(newCapturedPokemons);
    AsyncStorage.setItem('capturedPokemons', JSON.stringify(newCapturedPokemons));
};

  return (
    <View>
      <Text>Mon équipe</Text>
      <View>
        {capturedPokemons.map((pokemon: Pokemon, index: number) => (
          <View key={index}>
            <Image source={{ uri: pokemon.image }} style={{ width: 100, height: 100 }} />
            <Text>{pokemon.name}</Text>
            <TouchableOpacity onPress={() => releasePokemon(index)}>
              <Text style={{ color: 'red' }}>Relâcher</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

export default team;
