export default function goToProfile({ navigation, username, userId }) {
  return navigation.navigate("Profile", {
    username,
    userId,
  });
}
