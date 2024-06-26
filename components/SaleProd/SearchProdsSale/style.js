import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  blockSearch: {
    height: 50,
    width: "85%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  inputSearch: {
    height: 35,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    width: "100%",
  },

  iconSearch: {
    width: 30,
    height: 30,
  },
});

export default styles;
