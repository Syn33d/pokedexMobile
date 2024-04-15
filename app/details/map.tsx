import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Pokemon } from '../(tabs)/interfaces';
import { Link } from 'expo-router';
import { styles } from '../(tabs)/style';

const map = () => {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

    useEffect(() => {
        async function getRandomPokemon() {
            const randomId = Math.floor(Math.random() * 898) + 1;
            try {
                const response = await axios.get(`https://pokebuildapi.fr/api/v1/pokemon/${randomId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
                return null;
            }
        }

        async function fetchRandomPokemons() {
            const requests = [];
            for (let i = 0; i < 100; i++) {
                requests.push(getRandomPokemon());
            }
            const results = await Promise.all(requests);
            const filteredResults = results.filter(pokemon => pokemon !== null);
            setPokemonList(filteredResults);
        }

        fetchRandomPokemons();
    }, []);

    function generateRandomCoordinates() {
        const lyonLatitude = 45.7578;
        const lyonLongitude = 4.8320;

        // Générer des coordonnées aléatoires dans un rayon autour de Lyon
        const radius = 0.5; // en degrés
        const latitudeOffset = Math.random() * radius * 2 - radius;
        const longitudeOffset = Math.random() * radius * 2 - radius;

        const latitude = lyonLatitude + latitudeOffset;
        const longitude = lyonLongitude + longitudeOffset;

        return { latitude, longitude };
    }

    function generateRandomPokemonPositions(count: number) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push(generateRandomCoordinates());
        }
        return positions;
    };

    const randomPokemonPositions = generateRandomPokemonPositions(100);

    return (
        <View style={{ flex: 1 }}>
            <MapView style={{ flex: 1 }}
                initialRegion={{
                    latitude: 45.750000,
                    longitude: 4.850000,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                {pokemonList.map((pokemon, index) => (
                    <Marker key={index} coordinate={randomPokemonPositions[index]} title={pokemon.name} description="Un pokemon sauvage apparait" image={{ uri: pokemon.image, width: 25, height: 25 }}/>
                ))}
            </MapView>
        </View>
    );
}
export default map;
