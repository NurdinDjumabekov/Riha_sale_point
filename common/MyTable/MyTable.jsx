import { FlatList, Text, View } from "react-native";
import React from "react";

////style
import styles from "./style";

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
