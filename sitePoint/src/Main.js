import React, {useReducer} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import pokemon from 'pokemon';

import Pokemon from './components/Pokemon';

const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';

const initialState = {
  isLoading: false, // decides whether to show the activity indicator or not
  searchInput: '', // the currently input text
  name: '', // Pokemon name
  pic: '', // Pokemon image URL
  types: [], // Pokemon types array
  desc: '', // Pokemon description
};

function reducer(state, action) {
  switch (action.type) {
    case 'onChangeInput':
      return {
        ...state,
        searchInput: action.payload,
      };
    case 'isLoading':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case 'updatePokemon':
      return {
        ...state,
        name: action.name,
        pic: action.pic,
        types: action.types,
        desc: action.desc,
      };
    default:
      throw new Error();
  }
}
const getTypes = types => {
  return types.map(({slot, type}) => {
    return {
      id: slot,
      name: type.name,
    };
  });
};

const getDescription = entries => {
  return entries.find(item => item.language.name === 'en').flavor_text;
};

const Main = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const searchPokemon = async () => {
    try {
      const pokemonID = pokemon.getId(state.searchInput); // check if the entered Pokemon name is valid
      dispatch({
        type: 'isLoading',
        isLoading: true, // show the loader while request is being performed
      });
      const {data: pokemonData} = await axios.get(
        `${POKE_API_BASE_URL}/pokemon/${pokemonID}`,
      );
      const {data: pokemonSpecieData} = await axios.get(
        `${POKE_API_BASE_URL}/pokemon-species/${pokemonID}`,
      );
      const {name, sprites, types} = pokemonData;
      const {flavor_text_entries} = pokemonSpecieData;
      dispatch({
        type: 'updatePokemon',
        name,
        pic: sprites.front_default,
        types: getTypes(types),
        desc: getDescription(flavor_text_entries),
      });
      dispatch({
        type: 'isLoading',
        isLoading: false, // hide loader
      });
    } catch (err) {
      Alert.alert('Error', 'Pokemon not found');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.headContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={searchInput =>
                dispatch({type: 'onChangeInput', payload: searchInput})
              }
              value={state.searchInput}
              placeholder={'Search Pokemon'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={searchPokemon} title="Search" color="#0064e1" />
          </View>
        </View>
        <View style={styles.mainContainer}>
          {state.isLoading && (
            <ActivityIndicator size="large" color="#0064e1" />
          )}
          {!state.isLoading && (
            <Pokemon
              name={state.name}
              pic={state.pic}
              types={state.types}
              desc={state.desc}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  headContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 100,
  },
  textInputContainer: {
    flex: 2,
  },
  buttonContainer: {
    height: 35,
    flex: 1,
  },
  mainContainer: {
    flex: 9,
  },
  textInput: {
    height: 35,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#eaeaea',
    padding: 5,
  },
});

export default Main;
