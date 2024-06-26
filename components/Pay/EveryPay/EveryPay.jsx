import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { typesPay } from "../../../helpers/Data";
import { formatCount } from "../../../helpers/amounts";

////style
import styles from "./style";

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
