import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { gql, useMutation } from "@apollo/client";
import useMe from "../hooks/useMe";
import { logUserOut } from "../apollo";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  background-color: black;
  padding: 20px 0px 0px 0px;
`;
const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 15px;
`;
const DefaultAvatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;
const ProfileInfo = styled.View`
  padding-left: 20px;
  flex-direction: row;
  align-items: center;
`;
const Col = styled.View`
  padding: 0px 10px;
  align-items: center;
`;
const Followers = styled.Text`
  color: white;
  font-weight: bold;
`;
const FollowersText = styled.Text`
  color: white;
`;
const Followings = styled.Text`
  color: white;
  font-weight: bold;
`;
const FollowingsText = styled.Text`
  color: white;
`;
const PhotoNum = styled.Text`
  color: white;
  font-weight: bold;
`;
const PhotoNumText = styled.Text`
  color: white;
`;
const ProfileBioContainer = styled.View`
  padding: 0px 15px;
  margin-top: 20px;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 7px 0px;
  background-color: black;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: white;
`;

const Name = styled.Text`
  color: white;
`;
const Username = styled.Text`
  color: white;
  margin-top: 5px;
`;
const Bio = styled.Text`
  color: white;
  margin-top: 5px;
`;
const PhotoContainer = styled.View`
  width: 100%;
  margin-top: 15px;
  flex-direction: row;
  flex-wrap: wrap;
`;
const PhotoTouch = styled.TouchableOpacity`
  width: 33.1%;
  margin: 0.1%;
`;
const PhotoFeed = styled.Image`
  width: 100%;
  height: 140px;
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
      id
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
      id
    }
  }
`;
const LogoutButton = styled.TouchableOpacity``;

export default function MyProfiles({
  id,
  avatar,
  bio,
  firstName,
  lastName,
  username,
  photos,
  isFollowing,
  totalFollowers,
  totalFollowing,
  isMe,
}) {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { data: meData } = useMe();
  const fragmentId = `User:${id}`;
  const myFragmentId = `User:${meData?.me?.id}`;
  const ReversePhotos = [...photos].reverse();

  const followUserUpdate = (cache, result) => {
    const {
      data: {
        followUser: { ok },
      },
    } = result;
    if (ok) {
      // change user's followers
      cache.modify({
        id: fragmentId,
        fields: {
          isFollowing() {
            return true;
          },
          totalFollowers(prev) {
            return prev + 1;
          },
        },
      });
      // change my followings
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
          totalFollowers(prev) {
            return prev - 1;
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

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: followUserUpdate,
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: unfollowUserUpdate,
  });

  return (
    <Container style={{ minHeight: height }}>
      <ProfileContainer>
        {avatar === null ? (
          <DefaultAvatar source={require("../assets/default_profile.png")} />
        ) : (
          <Avatar source={{ uri: avatar }} />
        )}
        <ProfileInfo>
          <Col>
            <PhotoNum>{photos?.length}</PhotoNum>
            <PhotoNumText>Posts</PhotoNumText>
          </Col>
          <Col>
            <Followers>{totalFollowers}</Followers>
            <FollowersText>Followers</FollowersText>
          </Col>
          <Col>
            <Followings>{totalFollowing}</Followings>
            <FollowingsText>Followings</FollowingsText>
          </Col>
        </ProfileInfo>
      </ProfileContainer>
      <ProfileBioContainer>
        <Name>
          {firstName} {lastName}
        </Name>
        <Username>{username}</Username>
        <LogoutButton onPress={logUserOut}>
          <Ionicons name="log-out-outline" color="white" size={30} />
        </LogoutButton>
        {bio ? <Bio>{bio}</Bio> : null}
        {isMe ? (
          <ButtonContainer
            onPress={() =>
              navigation.navigate("EditProfile", {
                bio,
                firstName,
                lastName,
                username,
                avatar,
              })
            }
          >
            <ButtonText>Edit Profile</ButtonText>
          </ButtonContainer>
        ) : isFollowing ? (
          <ButtonContainer onPress={unfollowUser}>
            <ButtonText>Unfollow</ButtonText>
          </ButtonContainer>
        ) : (
          <ButtonContainer onPress={followUser}>
            <ButtonText>Follow</ButtonText>
          </ButtonContainer>
        )}
      </ProfileBioContainer>
      <PhotoContainer>
        {ReversePhotos.map((feed) => (
          <PhotoTouch
            key={feed.id}
            onPress={() => navigation.navigate("Photo", { photoId: feed.id })}
          >
            <PhotoFeed
              key={feed.id}
              resizeMode="cover"
              source={{ uri: feed.file }}
            />
          </PhotoTouch>
        ))}
      </PhotoContainer>
    </Container>
  );
}

MyProfiles.propTypes = {
  id: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  avatar: PropTypes.string,
  isFollowing: PropTypes.bool,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      file: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      commentNumber: PropTypes.number.isRequired,
      isLiked: PropTypes.bool.isRequired,
    })
  ),
  isMe: PropTypes.bool,
  totalFollowing: PropTypes.number,
  totalFollowers: PropTypes.number,
};
