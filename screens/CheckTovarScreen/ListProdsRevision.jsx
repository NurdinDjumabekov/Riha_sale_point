import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { statusColor, statusRevision } from "../../helpers/Data";

export const ListProdsRevision = ({ item, navigation, disable }) => {
  const lookInvoice = (invoice_guid) => {
    navigation.navigate("EveryRevisionRequest", {
      invoice_guid,
      disable,
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => lookInvoice(item?.guid)}
    >
      <View style={styles.innerBlock}>
        <Text style={styles.titleDate}>{item?.date}</Text>
        <View style={styles.mainData}>
          <Text style={styles.titleNum}>{item?.codeid} </Text>
          <View>
            <Text style={[styles.titleDate, styles.role]}>
              {item?.seller_from}
            </Text>
            <Text
              style={[styles.titleDate, { color: statusColor?.[item?.status] }]}
            >
              {statusRevision?.[item.status]}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.arrow}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingVertical: 20,
    paddingRight: 25,
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

  role: {
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
    color: "rgba(47, 71, 190, 0.672)",
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
