import React from 'react';
import {withSocket} from './Src/Utils/withSocket';
import StackNavigation from './Src/Navigations/StackNavigator';
const App = (props) => {
  return (
    <>
      <StackNavigation />
    </>
  );
};

export default withSocket(App);
