import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const EveryInvoiceReturn = ({ obj, navigation }) => {
  //// каждый возврат накладной типо истории

  const lookInvoice = () => {
    navigation?.navigate("listReturnProd", {
      obj,
      title: `Накладная №${obj?.codeid}`,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={lookInvoice}>
      <View style={styles.innerBlock}>
        <View style={styles.mainData}>
          <Text style={styles.titleNum}>{obj.codeid} </Text>
          <View>
            <Text style={[styles.titleDate, styles.role]}>{obj?.agent}</Text>
            <Text style={styles.titleDate}>{obj.date}</Text>
          </View>
        </View>
        {obj.comment?.length !== 0 && (
          <Text style={styles.comments} numberOfLines={4} ellipsizeMode="tail">
            {obj.comment}
          </Text>
        )}
      </View>
      <View style={styles.mainDataArrow}>
        <View>
          {+obj?.status ? (
            <Text style={styles.statusGood}>Подтверждён</Text>
          ) : (
            <Text style={styles.statusReload}>Ожидание</Text>
          )}
          <Text style={styles.totalPrice}>{obj?.total_price} сом</Text>
        </View>
        <View style={styles.arrow}></View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  innerBlock: {
    display: "flex",
    width: "58%",
    gap: 5,
  },

  titleNum: {
    fontSize: 19,
    fontWeight: "700",
    color: "rgba(47, 71, 190, 0.672)",
    borderColor: "rgba(47, 71, 190, 0.672)",
    borderWidth: 1,
    backgroundColor: "#d4dfee",
    padding: 3,
    paddingLeft: 7,
    paddingRight: 0,
    borderRadius: 5,
  },

  titleDate: {
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
  },

  statusGood: {
    color: "rgba(12, 169, 70, 0.9)",
  },

  statusReload: {
    color: "red",
  },

  role: {
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
    color: "rgba(47, 71, 190, 0.672)",
    width: "85%",
    // backgroundColor: "red",
    overflow: "hidden",
    height: 18,
  },

  mainDataArrow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
    width: "38%",
    // overflow: "hidden",
    // maxWidth: "40%",
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: "400",
    maxWidth: 110,
  },

  comments: {
    maxWidth: 230,
    fontSize: 12,
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(162, 178, 238, 0.439)",
    height: 16,
    width: 16,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },
});
