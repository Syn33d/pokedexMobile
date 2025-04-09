import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Pokemon } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

function team() {
const [capturedPokemons, setCapturedPokemons] = useState([]);

useEffect(() => {
  // Fonction pour récupérer les Pokémon capturés
    const fetchStoredPokemons = async () => {

      // Récupérer les Pokémon capturés depuis le stockage local
        const storedPokemons = JSON.parse(await AsyncStorage.getItem('capturedPokemons') || '[]');
        setCapturedPokemons(storedPokemons);
    };

    fetchStoredPokemons();
}, []);

// Fonction pour relâcher un Pokémon
const releasePokemon = (index: number) => {
    const newCapturedPokemons = [...capturedPokemons];
    
    // Supprimer le Pokémon à l'index donné
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
