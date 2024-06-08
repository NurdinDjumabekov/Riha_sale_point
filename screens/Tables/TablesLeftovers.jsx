import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { objTitleLeftov } from "../../helpers/Data";

export const TablesLeftovers = ({ arr }) => {
  return (
    <View style={styles.parentFlatList}>
      <View style={[styles.mainBlock, styles.more]}>
        <Text style={[styles.name, styles.moreText]}>
          {objTitleLeftov?.[1]}
        </Text>
        <Text style={[styles.price, styles.moreText]}>
          {objTitleLeftov?.[2]}
        </Text>
        <Text style={[styles.ostatokStart, styles.moreText]}>
          {objTitleLeftov?.[3]}
        </Text>
        <Text style={[styles.prihod, styles.moreText]}>
          {objTitleLeftov?.[4]}
        </Text>
        <Text style={[styles.rashod, styles.moreText]}>
          {objTitleLeftov?.[5]}
        </Text>
        <Text style={[styles.ostatokEnd, styles.moreText]}>
          {objTitleLeftov?.[6]}
        </Text>
      </View>
      <FlatList
        data={arr}
        renderItem={({ item, index }) => (
          <View style={styles.mainBlock}>
            <Text style={styles.name}>
              {index + 1}. {item?.product_name}
            </Text>
            <Text style={styles.price}>{item?.price}</Text>
            <Text style={styles.ostatokStart}>{item?.start_outcome}</Text>
            <Text style={styles.prihod}>{item?.income}</Text>
            <Text style={styles.rashod}>{item?.outcome}</Text>
            <Text style={styles.ostatokEnd}>{item?.end_outcome}</Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
        nestedScrollEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentFlatList: { flex: 1, width: "100%" },

  mainBlock: {
    paddingHorizontal: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(47, 71, 190, 0.287)",
    borderBottomWidth: 1,
  },

  more: {
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    borderTopColor: "rgba(47, 71, 190, 0.287)",
    borderTopWidth: 1,
  },

  moreText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 11,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    lineHeight: 12,
    paddingVertical: 12,
  },

  name: {
    fontSize: 11,
    fontWeight: "400",
    color: "#222",
    width: "28%",
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
    width: "16%",
    paddingHorizontal: 3,
    paddingLeft: 4,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  prihod: {
    fontSize: 12,
    fontWeight: "400",
    width: "16%",
    color: "green",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  rashod: {
    fontSize: 12,
    fontWeight: "400",
    width: "15%",
    color: "red",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  ostatokEnd: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "16%",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },

  price: {
    fontSize: 12,
    fontWeight: "400",
    color: "#222",
    width: "10%",
    paddingHorizontal: 3,
    borderRightColor: "rgba(47, 71, 190, 0.287)",
    borderRightWidth: 1,
    paddingVertical: 8,
    height: "100%",
    textAlignVertical: "center",
  },
});
