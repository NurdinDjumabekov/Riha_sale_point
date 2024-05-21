import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export const TablesLeftovers = ({ arr }) => {
  return (
    <View style={styles.parentFlatList}>
      <View style={[styles.mainBlock, styles.more]}>
        <Text style={[styles.name, styles.moreText]}>Товар</Text>
        <Text style={[styles.ostatokStart, styles.moreText]}>
          Остаток на начало
        </Text>
        <Text style={[styles.prihod, styles.moreText]}>Приход</Text>
        <Text style={[styles.rashod, styles.moreText]}>Расход</Text>
        <Text style={[styles.ostatokEnd, styles.moreText]}>
          Остаток на конец
        </Text>
      </View>
      <FlatList
        data={arr}
        renderItem={({ item, index }) => (
          <View style={styles.mainBlock}>
            <Text style={styles.name}>
              {index + 1}. {item?.product_name}
            </Text>
            <Text style={styles.ostatokStart}>{item?.start_outcome}</Text>
            <Text style={styles.prihod}>{item?.income}</Text>
            <Text style={styles.rashod}>{item?.outcome}</Text>
            <Text style={styles.ostatokEnd}>{item?.end_outcome}</Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentFlatList: { flex: 1 },

  mainBlock: {
    paddingHorizontal: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(47, 71, 190, 0.287)",
    borderBottomWidth: 1,
  },

  more: { backgroundColor: "rgba(212, 223, 238, 0.47)" },

  moreText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 12,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    lineHeight: 14,
    paddingVertical: 20,
  },

  name: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "34%",
    paddingHorizontal: 5,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  ostatokStart: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "19%",
    paddingHorizontal: 5,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
    // textAlign: "center",
  },

  prihod: {
    fontSize: 12,
    fontWeight: "400",
    width: "16%",
    color: "green",
    paddingHorizontal: 5,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
    // textAlign: "center",
  },

  rashod: {
    fontSize: 12,
    fontWeight: "400",
    width: "15%",
    color: "red",
    paddingHorizontal: 5,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
    // textAlign: "center",
  },

  ostatokEnd: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "17%",
    paddingHorizontal: 5,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
    // textAlign: "center",
  },
});
