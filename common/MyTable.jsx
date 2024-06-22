import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

export const MyTable = ({ arr }) => {
  return (
    <View style={styles.parentFlatList}>
      <View style={[styles.mainBlock, styles.more]}>
        <Text style={[styles.name, styles.moreText]}>Продукт</Text>
        <Text style={[styles.price, styles.moreText]}>Цена</Text>
        <Text style={[styles.count, styles.moreText]}>Кг (шт)</Text>
      </View>
      <FlatList
        data={arr}
        contentContainerStyle={styles.flatlist}
        renderItem={({ item, index }) => (
          <View style={styles.mainBlock}>
            <Text style={styles.name}>
              {index + 1}. {item?.product_name}
            </Text>
            <Text style={styles.price}>{item?.product_price} сом</Text>
            <Text style={styles.count}>
              {item?.count} {item?.unit}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentFlatList: { maxHeight: "75%" },

  mainBlock: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(47, 71, 190, 0.287)",
    borderBottomWidth: 1,
  },

  more: {
    paddingVertical: 20,
    backgroundColor: "rgba(212, 223, 238, 0.47)",
  },

  moreText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 14,
  },

  name: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "55%",
    paddingRight: 15,
  },

  price: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "22%",
    paddingRight: 10,
  },

  count: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "21%",
  },
});
