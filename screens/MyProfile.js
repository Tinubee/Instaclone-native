import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import styled from "styled-components/native";
import MyProfiles from "../components/MyProfiles";
import { gql, useQuery } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";

const LogoutButton = styled.TouchableOpacity``;
const ME_QUERY = gql`
  query me {
    me {
      id
      firstName
      lastName
      username
      bio
      avatar
      isFollowing
      photos {
        ...PhotoFragment
      }
      isMe
      totalFollowing
      totalFollowers
    }
  }
  ${PHOTO_FRAGMENT}
`;

export default function MyProfile({ navigation }) {
  const [refresh, setRefresh] = useState(false);
  const { data, loading, refetch } = useQuery(ME_QUERY);

  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, [data]);

  const refreshToRefetch = async () => {
    setRefresh(true);
    await refetch();
    setRefresh(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <ScrollView
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshToRefetch} />
        }
      >
        <MyProfiles
          id={data?.me?.id}
          avatar={data?.me?.avatar}
          bio={data?.me?.bio}
          firstName={data?.me?.firstName}
          lastName={data?.me?.lastName}
          username={data?.me?.username}
          isFollowing={data?.me?.isFollowing}
          photos={data?.me?.photos}
          totalFollowers={data?.me?.totalFollowers}
          totalFollowing={data?.me?.totalFollowing}
          isMe={data?.me?.isMe}
        />
      </ScrollView>
    </ScreenLayout>
  );
}
