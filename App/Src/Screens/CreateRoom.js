import React from 'react';
import {View, Text} from 'react-native';
import {v1 as uuid} from 'uuid';
import {withSocket} from '../Utils/withSocket';
const CreateRoom = (props) => {
  const {socket} = props;
  const onCreate = () => {
    const id = uuid();
    props.navigation.navigate('CreateRoom');
  };
  console.log(props, 'ROUTE');

  return (
    <View>
      <Text>2</Text>
    </View>
  );
};
export default withSocket(CreateRoom);
