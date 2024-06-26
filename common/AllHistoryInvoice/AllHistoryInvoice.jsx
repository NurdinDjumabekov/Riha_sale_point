import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { formatCount } from "../../helpers/amounts";

////style
import styles from "./style";

export const AllHistoryInvoice = (props) => {
  ////// отображаю все истонии накладных
  const { item, index, keyLink, navigation } = props;

  const nav = (guidInvoice) => {
    navigation.navigate(keyLink, { guidInvoice });
  };

  return (
    <TouchableOpacity
      style={styles.everyProd}
      onPress={() => nav(item?.invoice_guid)}
    >
      <View style={styles.everyProdInner}>
        <View style={styles.blockTitle}>
          <View style={styles.blockTitleInner}>
            <Text style={styles.titleNum}>{index + 1} </Text>
            <View>
              <Text style={styles.date}>{item?.date}</Text>
              <Text style={styles.sum}>
                {formatCount(item?.total_price)} сом
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.status}>
          {item?.status === 0 ? (
            <Text style={styles.bad}>Не подтверждено</Text>
          ) : (
            <Text style={styles.good}>Подтверждено</Text>
          )}
        </View>
      </View>
      {item?.comment && <Text style={styles.comment}>{item?.comment}</Text>}
    </TouchableOpacity>
  );
};
