import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TextInput, Modal, TouchableOpacity, ActivityIndicator, FlatList, Listitem, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import filter from 'lodash/filter';

export default function App() {
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [todos, setTodos] = useState([]);
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState([]); 
  const [filteredTodos, setFilteredTodos] = useState([])

  useEffect(() => {
    getTodoFromuserDevice();
  }, [])

  useEffect(() => {
    saveTodoTouserDevice(todos);
  }, [todos]);

  const Listitem = ({todo}) => { 
    return <View style={styles.listitem}>
    <View style={{flex: 1}}> 
      <Text style={
        {fontWeight: 'bold', fontSize: 15, color: 'black', textDecorationLine: todo?.completed? 'line-through' : 'none'} 
        }> 
      {todo?.titleInput} 
     </Text> 

     <Text style={
        {fontWeight: 'bold', fontSize: 15, color: 'black', textDecorationLine: todo?.completed? 'line-through' : 'none'} 
        }> 
      {todo?.descInput} 
     </Text> 

     </View>

     {!todo?.completed && (
       <TouchableOpacity style={styles.actionIcon} onPress={() => markTodoComplete(todo?.id)}>
       <Icon name='done' size={20} color='white' />
     </TouchableOpacity>

     )}
     <TouchableOpacity style={styles.actionIcon, {backgroundColor: 'red', height: 25}} 
     onPress={() => deleteTodo(todo?.id)}
     > 
       <Icon name='delete' size={25} color='white' />
     </TouchableOpacity>
    </View>

  };

  const saveTodoTouserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos)
    } catch (error) {
      console.log(error);
    }
  };

  const getTodoFromuserDevice = async () => {
    try{
      const todos = await AsyncStorage.getItem('todos'); 
      if (todos != null){
        setTodos(JSON.parse(todos)); 
        setFullData(JSON.parse(todos)); 
      }
    }
    catch (error) {
      console.log(error);
    } 

  };

  const addTodo = () => {

     if (titleInput == '')
  {
    Alert.alert('Error','Please input a Title');
  }
  else{
    const newTodo = {
      id: Math.random(),
      titleInput: titleInput,
      descInput: descInput,
      completed: false,
    };
    setTodos([...todos,newTodo]);
    setTitleInput('');
    setDescInput(''); 
    setModalVisible(false); 
  } 
    
  };

  const markTodoComplete = (todoId) => {
    const newTodos = todos.map(item => {
      if (item.id == todoId)
      {
        return {...item, completed: true};
      }
      return item;
    });
    setTodos(newTodos);
    setFilteredTodos(newTodos);
  };

  const deleteTodo = todoId => {
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
    setFilteredTodos(newTodos);
  };

  const handleOnDeleteAll = () => {
    setTodos([]);
    setFilteredTodos([]);
  }

  const clearTodo = () => {
    Alert.alert('Confirm', 'Clear Todos?', [
      {
        text: 'Yes',
        onPress: () => {setTodos([]),setFilteredTodos([])}
      },
      {
        text: 'No',
      }, 
    ]);
  };

  const handleSearch = text => {
    setFullData(todos)
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(fullData, titleInput => { 
      return contains(titleInput.titleInput.toLowerCase(), formattedQuery);
    });
    setFilteredTodos(filteredData); 
    setQuery(text); 
  };

  const contains = ( titleInput , query) => {
  
    if (titleInput.includes(query)) {
      return true;
    }
  
    return false;
  };


  return (
     <SafeAreaView style={styles.safearea}>

       <View style={styles.header}>
         <Text style={styles.todotext}>
           TODO APP
         </Text>
          <Icon name='delete' size={40} color='red' 
          onPress={clearTodo} 
          />
       </View>

       <View style={styles.searchBar}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={queryText => handleSearch(queryText)}
          placeholder="Search"
          style={{ backgroundColor: 'white', paddingHorizontal: 10, fontSize: 30, borderRadius: 25 }}
        />
      </View>

       <FlatList 
       showsVerticalScrollIndicator={false} 
       contentContainerStyle={{padding: 20, paddingBottom: 100}} 
       data={filteredTodos.length || query ? filteredTodos : todos}
       renderItem={({item}) => <Listitem todo={item} /> }
       />
          
          <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ width: '100%', }}>
            <View style={{ backgroundColor: 'white', borderRadius: 12, margin: 5, width: 200 }}>
              <TextInput
                placeholder='Enter a Title'
                style={{ padding: 20 }}
                onChangeText={(text) => setTitleInput(text)}
                value={titleInput}
                placeholderTextColor={'#ebb678'}
              />
            </View>
            <View style={{ backgroundColor: 'white', borderRadius: 12, margin: 5, width: 200 }}>
              <TextInput
                placeholder='Enter Description...'
                style={{ padding: 20, }}
                onChangeText={(text) => setDescInput(text)}
                value={descInput} 
                placeholderTextColor={'#ebb678'}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.add}
              onPress={addTodo}>
              <Text style={styles.todotext}>ADD</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.add, styles.cancel]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.todotext}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>


       <View style={styles.footer}>        

          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}> 
            <View style={styles.iconContainer}>
             <Icon name='add' size={40} color='white' /> 
            </View>
          </TouchableOpacity>

       </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  todotext: {
    fontSize: 20,
  },
  footer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    height: '16%',
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingLeft: 330,
  },
 
  iconContainer: {
    height: 60,
    width: 60,
    backgroundColor: 'darkblue', 
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35, 
  },
  listitem: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 7,
    elevation: 12,
    marginVertical: 8,
    flexDirection: 'row', 
  },
  actionIcon: {
    height: 25,
    width: 25,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3, 
    backgroundColor: 'green',
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderRadius: 50
  },
  modalView: {
    margin: 20,
    backgroundColor: "teal",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  add: {
    backgroundColor: 'yellow',
    width: 100,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  cancel: {
    backgroundColor: 'red'

  },
});
  