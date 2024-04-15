export interface PokemonType {
  name: string;
  image: string;
}

export interface PokemonDetails extends Pokemon {
  resistances: {
    name: string;
    damage_multiplier: number;
    damage_relation: string;
  }[];

  evolution: {
    name: string;
    pokedexId: string;
  }[];

  preEvolution: {
    name: string;
    pokedexIdd: number;
  };

  image: string;
}

export interface Pokemon {
  name: string;
  apiTypes: PokemonType[];
  apiResistances: PokemonDetails['resistances'];
  apiEvolutions: PokemonDetails['evolution'];
  apiPreEvolution: PokemonDetails['preEvolution'];

  stats: {
    HP: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };

  image: string;
  pokedexId: number;
  apiGeneration: number;
}

// export interface Pokemon {
//   id : number;
//   type1 : string;
//   type2 : string;
//   name : string;
//   sprite : string;
//   hp : number;
//   attack : number;
//   defense : number;
//   sp_attack : number;
//   sp_defense : number;
//   captured : boolean;
// }