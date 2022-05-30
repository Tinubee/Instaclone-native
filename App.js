import AppLoading from "expo-app-loading";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { NavigationContainer } from "@react-navigation/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { client, isLoggedInVar, tokenVar } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const preloadAssets = () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [require("./assets/logo.png")];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all([...fontPromises, ...imagePromises]);
  };

  useEffect(() => {
    const preLoad = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        isLoggedInVar(true);
        tokenVar(token);
      }
      try {
        await SplashScreen.preventAutoHideAsync();
        preloadAssets();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(true);
      }
    };
    preLoad();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (loading) {
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
  );
}
