import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { typesPay } from "../../helpers/Data";
import { formatCount } from "../../helpers/amounts";

const EveryPay = ({ item }) => {
  return (
    <View style={styles.everyProd}>
      <View style={styles.everyProdInner}>
        <View style={styles.blockTitle}>
          <View style={styles.blockTitleInner}>
            <Text style={styles.date}>{item?.date_system}</Text>
          </View>
          <Text style={styles.type}>{typesPay?.[item?.transaction_type]}</Text>
          <Text style={styles.comment}>{item.comment || "..."}</Text>
        </View>
        <View style={styles.status}>
          <Text style={styles.good}>Успешно</Text>
          <Text style={styles.sum}>{formatCount(item?.total)} сом</Text>
        </View>
      </View>
    </View>
  );
};

export default EveryPay;

const styles = StyleSheet.create({
  everyProd: {
    padding: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    marginVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.107)",
    width: "97%",
    alignSelf: "center",
  },

  everyProdInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  blockTitle: { width: "67%" },

  blockTitleInner: {
    display: "flex",
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
  },

  date: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(47, 71, 190, 0.687)",
    lineHeight: 17,
  },

  type: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(12, 169, 70, 0.9)",
    lineHeight: 15,
    marginTop: 5,
  },

  comment: { fontSize: 14, fontWeight: "400", marginTop: 5 },

  status: { width: "27%" },

  sum: { fontSize: 15, fontWeight: "400", color: "rgba(12, 169, 70, 0.9)" },

  good: { color: "rgba(12, 169, 70, 0.9)", fontSize: 15, fontWeight: "500" },
});
