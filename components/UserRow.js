import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../colors";
import goToProfile from "../hooks/goToProfile";
import useMe from "../hooks/useMe";

const FLOWUSER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
      id
    }
  }
`;
const UNFLOWUSER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
      id
    }
  }
`;

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
`;
const Username = styled.Text`
  font-weight: 600;
  color: white;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
`;
const FollowBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  border-radius: 7px;
`;
const FollowBtnText = styled.Text`
  color: white;
  font-weight: 600;
`;

export default function UserRow({ avatar, id, username, isFollowing, isMe }) {
  const navigation = useNavigation();
  const { data: meData } = useMe();
  const fragmentId = `User:${id}`;
  const myFragmentId = `User:${meData?.me?.id}`;

  const followUserUpdate = (cache, result) => {
    const {
      data: {
        followUser: { ok },
      },
    } = result;
    if (ok) {
      cache.modify({
        id: fragmentId,
        fields: {
          isFollowing() {
            return true;
          },
        },
      });

      cache.modify({
        id: myFragmentId,
        fields: {
          totalFollowing(prev) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [followUser] = useMutation(FLOWUSER_MUTATION, {
    variables: {
      username,
    },
    update: followUserUpdate,
  });

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;

    if (ok) {
      cache.modify({
        id: fragmentId,
        fields: {
          isFollowing() {
            return false;
          },
        },
      });

      cache.modify({
        id: myFragmentId,
        fields: {
          totalFollowing(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [unfollowUser] = useMutation(UNFLOWUSER_MUTATION, {
    variables: {
      username,
    },
    update: unfollowUserUpdate,
  });

  return (
    <Wrapper>
      <Column onPress={() => goToProfile({ navigation, username, userId: id })}>
        <Avatar source={{ uri: avatar }} />
        <Username>{username}</Username>
      </Column>
      {!isMe ? (
        <FollowBtn onPress={isFollowing ? unfollowUser : followUser}>
          <FollowBtnText>{isFollowing ? "Unfollow" : "Follow"}</FollowBtnText>
        </FollowBtn>
      ) : null}
    </Wrapper>
  );
}
