import React from "react";
import UserRegistryScreen from "./src/pages/Main";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

const App = () => {
  return (
    <View style={styles.rootContainer}>
      <StatusBar style="dark" backgroundColor="#f3f4f6" />
      <UserRegistryScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
});

export default App;
