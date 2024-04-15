import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import axios from 'axios';
import { Pokemon, PokemonDetails } from '../(tabs)/interfaces';
import { TypeImage } from '../(tabs)/index';
import { styles } from '../(tabs)/style';
import { AllRoutes, Link, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

const details = () => {
    const { id } = useLocalSearchParams<AllRoutes>();
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
    const [description, setDescription] = useState<string>('');
    const [species, setSpecies] = useState<string>('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [imageEvolution, setImageEvolution] = useState<string>('');
    const [imagePreEvolution, setImagePreEvolution] = useState<string>('');
    const [pokemonCry, setPokemonCry] = useState<string>('');

    useEffect(() => {
        if (id) {
            axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${id}`).then(response =>
                setPokemon(response.data));

            axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(speciesResponse => {
                const descriptions = speciesResponse.data.flavor_text_entries.filter((entry: { language: { name: string; }; version: { name: string; }; }) => {
                    return entry.language.name === 'fr' && (entry.version.name === 'sword' || entry.version.name === 'shield' || entry.version.name === 'letsgoeevee');
                }).map((entry: { flavor_text: string; }) => entry.flavor_text);
                setDescription(descriptions);

                const species = speciesResponse.data.genera.filter((entry: { language: { name: string; }; }) => entry.language.name === 'fr').map((entry: { genus: string; }) => entry.genus);
                setSpecies(species);
            });

            setPokemonCry(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);

            const soundObject = new Audio.Sound();
            const playSound = async () => {
                await soundObject.loadAsync(require('../audio/pokedexAudio.mp3'));
                await soundObject.playAsync();
            };
            playSound();
            return () => {
                // Arrêter la lecture de l'audio lors du démontage du composant
                soundObject.stopAsync();
                soundObject.unloadAsync();
                // Arrêter la lecture vocale
                Speech.stop();
            };
        }
    }, [id]);
    

    function getResistances(resistances: PokemonDetails['resistances']) {
        return resistances.map((resistance) => (
            <View key={pokemon!.pokedexId}>
                {pokemon!.pokedexId !== 0 && <Text style={[styles.text, styles.text]}>{'\n'}</Text>}
                <Text style={[styles.text, styles.text]}><Text style={{ fontWeight: 'bold' }}>Résistance:</Text> {resistance.name}</Text>
                <Text style={[styles.text, styles.text]}><Text style={{ fontWeight: 'bold' }}>Multiplicateur de dégâts:</Text> {resistance.damage_multiplier}x</Text>
                <Text style={[styles.text, styles.text]}><Text style={{ fontWeight: 'bold' }}>Relation:</Text> {resistance.damage_relation}</Text>
            </View>
        ));
    }

    function getEvolutions(evolution: PokemonDetails['evolution'][0], preEvolution: PokemonDetails['preEvolution']) {
        return (
            <View>
                {preEvolution.name ? (
                    axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${pokemon?.apiPreEvolution.pokedexIdd}`).then(response => {
                        setImagePreEvolution(response.data.image);
                    }),
                                
                    <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Evolution précédente:</Text> {preEvolution.pokedexIdd} {preEvolution.name} <Image source={{ uri: imagePreEvolution }} style={{ width: 50, height: 50 }} /> {'\n'} </Text>
                ) : (
                    <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Evolution précédente:</Text> aucune</Text>
                )}

                {evolution ? (
                    axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${pokemon?.apiEvolutions[0].pokedexId}`).then(response => {
                        setImageEvolution(response.data.image);
                    }),
            
                    <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Evolution suivante:</Text> {evolution.pokedexId} {evolution.name} <Image source={{ uri: imageEvolution }} style={{ width: 50, height: 50 }} /> {'\n'} </Text>
                ) : (
                    <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Evolution suivante:</Text> aucune</Text>
                )}
            </View>
        );
    }

    const evoliEvolutions = [
        [
            { name: 'Pyroli', pokedexId: '136' },
            { name: 'Aquali', pokedexId: '134' },
            { name: 'Voltali', pokedexId: '135' },
            { name: 'Mentali', pokedexId: '196' },
            { name: 'Noctali', pokedexId: '197' },
            { name: 'Givrali', pokedexId: '471' },
            { name: 'Phyllali', pokedexId: '470' },
            { name: 'Nymphali', pokedexId: '700' },
        ],
    ];

    function getEvolutionOfEvoli() {
        return (
            <View>
                <Text style={[styles.text, styles.text, { fontWeight: 'bold' }]}>Evolutions :</Text>
                {evoliEvolutions[0].map((evo) => (
                    <Text key={pokemon!.pokedexId} style={[styles.text, styles.text]}>{evo.pokedexId} {evo.name}</Text>
                ))}
            </View>
        );
    }

    const playPokemonCry = async () => {
        if (pokemonCry) {
            const soundObject = new Audio.Sound();
            try {
                await soundObject.loadAsync({ uri: pokemonCry });
                await soundObject.playAsync();
            } catch (error) {
                console.error('Impossible de charger ou de lire le cri du Pokémon:', error);
            }
        }
    };

    const toggleSpeaking = () => {
        if (isSpeaking) {
            Speech.stop();
        } else {
            const textToSpeak = `${pokemon!.name}, ${Array.isArray(species) ? species.join(' ') : species} c'est un pokemon de type ${getTypes(pokemon!.apiTypes)}. ${Array.isArray(description) ? description.join(' ') : description}`;
            Speech.speak(textToSpeak);
        }
        setIsSpeaking(!isSpeaking);
    };

    const getTypes = (types: any) => {
        return types.map((type: { name: any; }) => type.name).join(' et ');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView contentContainerStyle={styles.container}>
                {pokemon && (
                    <>
                        <Text style={styles.text}>{pokemon.name}</Text>
                        <Image source={{ uri: pokemon.image }} style={{ width: 50, height: 50 }} />

                        <Text style={[styles.centeredTypes, styles.text]}>Type(s) <TypeImage types={pokemon.apiTypes} /></Text>

                        <Text style={[styles.centeredStats, styles.text]}>STATS</Text>
                        <View>
                            <View style={styles.centeredStats}>
                                <Text style={styles.text}>HP {pokemon.stats.HP}</Text>
                            </View>

                            <View style={styles.centeredStats}>
                                <Text style={styles.text}>Attack {pokemon.stats.attack}</Text>
                            </View>

                            <View style={styles.centeredStats}>
                                <Text style={styles.text}>Defense {pokemon.stats.defense}</Text>
                            </View>

                            <View style={styles.centeredStats}>
                                <Text style={styles.text}>Special Attack {pokemon.stats.special_attack}</Text>
                            </View>

                            <View style={styles.centeredStats}>
                                <Text style={styles.text}>Special Defense {pokemon.stats.special_defense}</Text>
                            </View>

                            <View style={styles.centeredStats}>
                                <Text style={styles.text}>Speed {pokemon.stats.speed}</Text>
                            </View>
                        </View>

                        <View>
                            <TouchableOpacity style={styles.primaryButton} onPress={playPokemonCry}>
                                <Text style={[styles.text, { color: 'blue' }]}>Écouter le hurlement</Text>
                            </TouchableOpacity>
                            {isSpeaking && (
                                <TouchableOpacity onPress={playPokemonCry}>
                                    <Text>{'Arrêter la lecture'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View>
                            <TouchableOpacity style={styles.primaryButton} onPress={toggleSpeaking}>
                                <Text style={[styles.text, { color: 'blue' }]}>Afficher la description</Text>
                            </TouchableOpacity>
                            {isSpeaking && (
                                <TouchableOpacity onPress={toggleSpeaking}>
                                    <Text>{'Arrêter la lecture'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={styles.centeredResistances}>Resistances</Text>
                        {getResistances(pokemon.apiResistances)}

                        <Text style={styles.centeredFamily}>Family</Text>
                        {pokemon.pokedexId === 133 ? getEvolutionOfEvoli() : getEvolutions(pokemon.apiEvolutions[0], pokemon.apiPreEvolution)}
                        <Text>{'\n'}</Text>
                        <Link href="/pokemonList" asChild>
                            <Pressable>
                                <Text style={[styles.primaryButton, styles.text]}>Retour</Text>
                            </Pressable>
                        </Link>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default details; 