import { Pressable, TouchableOpacity } from 'react-native';
import { styles } from './style';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Pokemon, PokemonType } from './interfaces';
import { Link, useNavigation } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { useEffect } from 'react';
import { Audio } from 'expo-av';


export type RootStackParamList = {
  index: undefined;
  list: undefined;
};

export function TypeImage({ types }: { types: PokemonType[] }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {types.map((type, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <View style={{ marginLeft: 5 }}></View>}
          <Image
            source={{ uri: type.image }} // Utilisez directement l'URL d'image du type
            style={{ width: 20, height: 20, marginRight: 5, resizeMode: 'contain' }}
          />
          <Text>{type.name}</Text>
        </React.Fragment>
      ))}
    </View>
  );
}


export default function home() {
  const [pokemons, setPokemon] = useState<Pokemon[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number>(0);

  const [audioObject, setAudioObject] = useState<Audio.Sound | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require('../audio/generiqueAudio.mp3'));
        await soundObject.playAsync();
        setAudioObject(soundObject);
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier audio:', error);
      }
    };

    loadAndPlayAudio();

    return () => {
      if (audioObject) {
        audioObject.stopAsync();
        audioObject.unloadAsync();
      }
    };
  }, []);

  // Arrêter l'audio lorsqu'un lien est cliqué pour naviguer vers une autre page
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      if (audioObject) {
        audioObject.stopAsync();
        audioObject.unloadAsync();
      }
    });

    return unsubscribe;
  }, [navigation, audioObject]);


  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={styles.title}>Attrapez-les tous !</Text>
        <Link href="/pokemonList" asChild>
          <Pressable>
            <Text style={[styles.primaryButton]}>Fetch Pokemons</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}