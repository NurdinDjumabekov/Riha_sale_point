import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dateSort: { position: "relative" },

  btnDate: { width: 25, height: 25 },

  btnDateIcon: { width: 25, height: 25 },

  calendar: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22222278",
    position: "relative",
  },

  calendarInner: {
    width: "100%",
    height: 420,
  },

  actionBtn: {
    width: 80,
    // height: 40,
    color: "#fff",
    borderRadius: 5,
    position: "absolute",
    fontSize: 16,
    paddingBottom: 8,
    paddingTop: 8,
    right: 20,
    bottom: 20,
    backgroundColor: "rgba(47, 71, 190, 0.591)",
  },
});

export default styles;
