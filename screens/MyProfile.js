import React, { useEffect } from "react";
import { Text, View } from "react-native";
import useMe from "../hooks/useMe";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { logUserOut } from "../apollo";

const LogoutButton = styled.TouchableOpacity``;

export default function MyProfile({ navigation }) {
  const { data } = useMe();
  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, []);

  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LogoutButton onPress={logUserOut}>
        <Ionicons name="log-out-outline" color="white" size={30} />
      </LogoutButton>
    </View>
  );
}
