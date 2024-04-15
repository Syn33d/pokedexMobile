import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Pressable, ScrollView } from 'react-native';
import { styles } from './style';
import axios from 'axios';
import { Pokemon } from './interfaces';
import { Link } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TypeImage } from '.';

const pokemonList = () => {
  const [pokemons, setPokemon] = useState<Pokemon[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = () => {
    axios('https://pokebuildapi.fr/api/v1/pokemon').then((response) => {
      setPokemon(response.data);
      if (selectedGeneration === 0) {
        setItemsPerPage(50)
      }
    })
  };


  const handleGenerationChange = (generation: number) => {
    setSelectedGeneration(generation);
    setCurrentPage(1);

    if (generation !== 0) {
      axios.get(`https://pokebuildapi.fr/api/v1/pokemon/generation/${generation}`).then((response) => {
        setPokemon(response.data);
        setItemsPerPage(response.data.length);
      });
    } else {
      fetchPokemons();
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filterByGeneration = (pokemonList: Pokemon[]) => {
    if (selectedGeneration === 0) {
      return pokemonList;
    }
    return pokemonList.filter(pokemon => pokemon.apiGeneration === selectedGeneration);
  }

  const filterByType = (pokemonList: Pokemon[]) => {
    if (selectedType === '') {
      return pokemonList;
    }
    return pokemonList.filter(pokemon => pokemon.apiTypes.some(type => type.name.toLowerCase().includes(selectedType.toLowerCase())));
  }

  const filterByName = (pokemonList: Pokemon[]) => {
    if (selectedName === '') {
      return pokemonList;
    }
    return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(selectedName.toLowerCase()));
  }

  const filterById = (pokemonList: Pokemon[]) => {
    if (selectedId === 0) {
      return pokemonList;
    }
    return pokemonList.filter(pokemon => pokemon.pokedexId === selectedId);
  }

  const scrollToTable = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const capturePokemon = async (pokemon: Pokemon) => {
    let capturedPokemons = JSON.parse(await AsyncStorage.getItem('capturedPokemons') || '[]');
    capturedPokemons.push(pokemon);
    AsyncStorage.setItem('capturedPokemons', JSON.stringify(capturedPokemons));
  };

  const pokemonsToDisplay = filterById(filterByType(filterByName(filterByGeneration(pokemons))));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pokemonsToDisplay.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pokemons.length / itemsPerPage);
  const pickerRef = useRef<Picker<number>>(null);
  const pickerRefPage = useRef<Picker<number>>(null);

  return (
    <ScrollView style={{ flex: 1 }} ref={scrollViewRef}>
      <ScrollView horizontal={true}>
        <View style={{ padding: 10 }}>
          <View>
            <Link href="/" asChild>
              <Pressable>
                <Text style={[styles.primaryButton, styles.text]}>Cancel Pokemons</Text>
              </Pressable>
            </Link>
            <Link href="/team" asChild>
              <Pressable>
                <Text style={[styles.primaryButton, styles.text]}>My Team</Text>
              </Pressable>
            </Link>

            <Link href="/details/map" asChild>
              <Pressable>
                <Text style={[styles.primaryButton, styles.text]}>Carte</Text>
              </Pressable>
            </Link>

            <View>
              <Pressable onPress={() => pickerRef.current?.focus()}>
                <Text style={[styles.primaryButton, styles.text]}>Génération: {selectedGeneration}</Text>
              </Pressable>
              <Picker ref={pickerRef} selectedValue={selectedGeneration} onValueChange={(itemValue: number) => handleGenerationChange(itemValue)}>
                <Picker.Item label="Toutes" value={0} />
                <Picker.Item label="1" value={1} />
                <Picker.Item label="2" value={2} />
                <Picker.Item label="3" value={3} />
                <Picker.Item label="4" value={4} />
                <Picker.Item label="5" value={5} />
                <Picker.Item label="6" value={6} />
                <Picker.Item label="7" value={7} />
                <Picker.Item label="8" value={8} />
              </Picker>

              {selectedGeneration === 0 ? (
                <Text style={styles.text}>Nombre de pokemons : {pokemons.length}</Text>
              ) : (
                <Text style={styles.text}>Nombre de pokemons de la génération {selectedGeneration} : {pokemonsToDisplay.length} sur {pokemons.length}</Text>
              )}
            </View>

            <View style={styles.container}>
              <TextInput style={[styles.input, styles.text]}
                placeholder="Rechercher un pokemon"
                placeholderTextColor="white"
                value={selectedName}
                onChangeText={(text) => setSelectedName(text)}
              />
            </View>

            <View style={styles.container}>
              <TextInput style={[styles.input, styles.text]}
                placeholder="Rechercher un type"
                placeholderTextColor="white"
                value={selectedType}
                onChangeText={(text) => setSelectedType(text)}
              />
            </View>

            <View style={styles.container}>
              <TextInput style={[styles.input, styles.text]}
                placeholder="Pokemon par ID"
                placeholderTextColor="white"
                onChangeText={(text) => setSelectedId(Number(text))}
              />
            </View>

            <View>
              <View style={styles.tableRow}>
                <Text style={[styles.text, { marginLeft: 10 }]}>#</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Apparence</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Nom</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Type(s)</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>HP</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Attaque</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Défense</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Attaque spéciale</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Défense spéciale</Text>
                <Text style={[styles.text, { marginLeft: 20 }]}>Speed</Text>
              </View>

              {currentItems.map((pokemon) => (
                <View key={pokemon.pokedexId} style={styles.tableRow}>
                  <Text style={styles.text}>{pokemon.pokedexId}</Text>
                  <Image source={{ uri: pokemon.image }} style={{ width: 50, height: 50 }} />
                  <Text style={styles.text}>{pokemon.name}</Text>
                  <Text style={styles.text}><TypeImage types={pokemon.apiTypes} /></Text>
                  <Text style={styles.text}>{pokemon.stats.HP}</Text>
                  <Text style={styles.text}>{pokemon.stats.attack}</Text>
                  <Text style={styles.text}>{pokemon.stats.defense}</Text>
                  <Text style={styles.text}>{pokemon.stats.special_attack}</Text>
                  <Text style={styles.text}>{pokemon.stats.special_defense}</Text>
                  <Text style={styles.text}>{pokemon.stats.speed}</Text>
                  <View>
                    <TouchableOpacity onPress={() => capturePokemon(pokemon)}>
                      <Text style={styles.text}>Capturer</Text>
                    </TouchableOpacity>

                    <Link href={`/details/${pokemon.pokedexId}`}>
                      <Text style={styles.text}>Voir les détails</Text>
                    </Link>


                  </View>
                </View>
              ))}
            </View>

            <View style={styles.tableRow}>
              <TouchableOpacity disabled={currentPage === 1} onPress={() => {
                handlePageChange(currentPage - 1);
                scrollToTable();
              }}>
                <Text style={styles.text}>Précédent</Text>
              </TouchableOpacity>

              <Pressable onPress={() => pickerRefPage.current?.focus()}>
                <Text style={[styles.primaryButton, styles.text]}>Page: {currentPage}</Text>
              </Pressable>

              <Picker
              ref={pickerRefPage}
                selectedValue={currentPage}
                style={{ height: 50, width: 100 }}
                onValueChange={(itemValue) => {
                  handlePageChange(itemValue);
                  scrollToTable();
                }}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Picker.Item key={index + 1} label={`${index + 1}`} value={index + 1} />
                ))}
              </Picker>

              <TouchableOpacity disabled={currentPage === totalPages} onPress={() => {
                handlePageChange(currentPage + 1);
                scrollToTable();
              }}>
                <Text style={styles.text}>Suivant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScrollView >
  );
}

export default pokemonList;