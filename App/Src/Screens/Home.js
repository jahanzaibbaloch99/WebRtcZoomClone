import React from 'react';
import {SafeAreaView, View, TouchableOpacity, Text} from 'react-native';
import {withSocket} from '../Utils/withSocket';
import {v1 as uuid} from 'uuid';
const Home = (props) => {
  const onCreate = () => {
    const id = uuid();
    props.navigation.navigate('Rooms', {
      id,
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: 50,
            width: '60%',
            backgroundColor: 'red',
            marginVertical: 10,
          }}>
          <Text>Join Room</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCreate}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: 50,
            width: '60%',
            backgroundColor: 'red',
          }}>
          <Text>Create Room</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default withSocket(Home);
