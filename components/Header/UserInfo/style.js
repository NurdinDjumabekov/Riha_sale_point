import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  parentBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  user: {
    width: 35,
    height: 35,
  },

  userRole: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 15,
  },

  userName: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 15,
    color: "rgba(47, 71, 190, 0.987)",
  },
});

export default styles;
