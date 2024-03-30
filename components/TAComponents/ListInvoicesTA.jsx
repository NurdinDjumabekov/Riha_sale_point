import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { ViewButton } from "../customsTags/ViewButton";
import { clearAcceptInvoiceTA } from "../store/reducers/stateSlice";
import { useDispatch } from "react-redux";

export const EveryMyInvoice = ({ obj, navigation }) => {
  //// список загрузок(накладных)
  const dispatch = useDispatch();

  // console.log(obj, "obj");
//   const lookInvoice = () => {
//     navigation.navigate("detailedInvoice", { date: obj.date, guid: obj.guid });
//     dispatch(clearAcceptInvoiceTA());
//   };

  return (
    <>
      <TouchableOpacity style={styles.container} >
        {/* <View style={styles.innerBlock}>
          <View style={styles.mainData}>
            <Text style={styles.titleNum}>{obj.codeid} </Text>
            <Text style={styles.titleDate}>{obj.date}</Text>
          </View>
          {obj.comment?.length !== 0 && (
            <Text
              style={styles.comments}
              numberOfLines={4}
              ellipsizeMode="tail"
            >
              {obj.comment}
            </Text>
          )}
        </View>
        <View style={styles.mainDataArrow}>
          <View>
            <Text style={styles.status}>Отгружено</Text>
            <Text style={styles.totalPrice}>{obj?.total_price} сом</Text>
          </View>
          <View style={styles.arrow}></View>
        </View> */}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    // marginBottom: 20,
    padding: 8,
    paddingTop: 15,
    paddingBottom: 15,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  innerBlock: {
    display: "flex",
    width: "60%",
    // backgroundColor: "red",
  },

  titleNum: {
    fontSize: 20,
    fontWeight: "700",
    // color: "rgba(12, 169, 70, 0.9)",
    color: "rgba(47, 71, 190, 0.672)",
    // borderBottomWidth: 1,
    // borderRightWidth: 1,
    // borderColor: "rgba(47, 71, 190, 0.672)",
    // textAlign: "center",
  },

  titleDate: {
    fontSize: 14,
    fontWeight: "500",
    // color: "rgba(47, 71, 190, 0.672)",
    // color: "#2fce8e53",
    // backgroundColor: "rgba(12, 169, 70, 0.1)",
    borderRadius: 5,
    // padding: 5,
  },

  status: {
    color: "rgba(12, 169, 70, 0.9)",
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: "400",
    // color: "blue",
  },

  comments: {
    // backgroundColor: "red",
    maxWidth: 230,
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  mainDataArrow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "red",
    paddingRight: 15,
    width: "35%",
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    // borderColor: "rgba(12, 169, 70, 0.498)",
    borderColor: "rgba(162, 178, 238, 0.439)",
    height: 16,
    width: 16,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },
  ////////////////////////////////

  titleMoreDate: {
    fontSize: 20,
    color: "#fff",
    position: "absolute",
    top: -10,
    right: 15,
    zIndex: 10,
    backgroundColor: "rgb(102 105 245)",
    padding: 4,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 4,
  },

  imgIcon: {
    width: 35,
    height: 35,
  },
  btn: {
    backgroundColor: "transparent",
    color: "rgba(97 ,100, 239,0.7)",
    width: "100%",
    paddingTop: 0,
    borderRadius: 0,
    fontWeight: 600,
    borderTopWidth: 1,
    borderTopColor: "rgb(217 223 232)",
    marginTop: 5,
  },
});
