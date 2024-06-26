import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  main: { flex: 1 },

  container: {
    flex: 1,
    minWidth: "100%",
    marginBottom: 20,
    marginTop: 0,
    borderRadius: 8,
    paddingTop: 5,
  },

  head: { height: 60, backgroundColor: "rgba(199, 210, 254, 0.250)" },

  text: {
    margin: 4,
    marginBottom: 8,
    marginTop: 8,
    fontSize: 13,
  },

  rowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(199, 210, 254, 0.718)",
    paddingLeft: 2,
  },

  textTitle: {
    fontSize: 13,
    fontWeight: "500",
    paddingRight: 0,
    paddingLeft: 5,
    color: "#383838",
  },

  divAction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 5,
    width: "100%",
    paddingRight: 20,
    paddingLeft: 10,
    borderTopColor: "#222",
    borderTopWidth: 1,
  },

  blockTotal: {
    paddingTop: 10,
  },

  totalItemCount: {
    fontSize: 17,
    fontWeight: "500",
    color: "#222",
  },

  /////// checkbox
  standartBox: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "rgb(206 217 230)",
    borderRadius: 7,
    backgroundColor: "rgba(95, 230, 165, 0.99)",
  },
  standartBox__inner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    bottom: 3,
  },
  checkmark: {
    width: 15,
    height: 23,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
    transform: [{ rotate: "45deg" }],
  },
  /////// checkbox

  sendBtn: {
    fontSize: 16,
    color: "#fff",
    width: "95%",
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  /////////////////////////////////////

  delete: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  crossLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    borderRadius: 5,
    backgroundColor: "red",
    transform: [{ rotate: "45deg" }],
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});

export default styles;
