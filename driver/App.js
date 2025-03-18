// App.js
import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import store from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle='dark-content' />
      <AppNavigator />
    </Provider>
  );
};

export default App;
