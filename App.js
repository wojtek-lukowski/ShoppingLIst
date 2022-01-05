import React from 'react';
import { Button, FlatList } from 'react-native-web';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

export default class App extends React.Component {

  constructor() {
    super();
    
    const firebaseConfig = {
      apiKey: "AIzaSyD-R7C9Sv4ybj5j8-F9MWIW3jrJTuAti6Y",
      authDomain: "shopping-list-wojtek.firebaseapp.com",
      projectId: "shopping-list-wojtek",
      storageBucket: "shopping-list-wojtek.appspot.com",
      messagingSenderId: "623332419240",
      appId: "1:623332419240:web:a0be9d544363c338ae449d"
    };

    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
      }

      this.referenceShoppingList = firebase.firestore().collection('shoppinglist');

      this.state = {
        lists: []
      };
  }

  componentDidMount() {
    this.referenceShoppingList = firebase.firestore().collection('shoppinglist');
    this.unsubscribe = this.referenceShoppingList.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  }

  addList() {
    this.referenceShoppingList.add({
      name: 'NewList',
      items: ['wine, beer, whiskey']
    });
  }

  render() {
    console.log('state', this.state.lists);

    return (
      <View style={styles.container}>
        <Text style={styles.text}>All Lists</Text>
        <FlatList
        data={this.state.lists}
        renderItem={({ item }) => 
        <Text style={styles.list}>{item.name}: {item.items}</Text>}
        ></FlatList>
        <Button title="Add list"
        onPress={() => this.addList()}></Button>
        <StatusBar style="auto" />
      </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 25
  },
  list: {
    color: 'blue',
    fontSize: 20
  }
});
