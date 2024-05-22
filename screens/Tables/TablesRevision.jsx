import React from "react";
import { FlatList, Keyboard, KeyboardAvoidingView } from "react-native";
import { StyleSheet, Text, View, Platform } from "react-native";
import { CheckVes } from "../../components/CheckProd/CheckVes";
import { Dimensions } from "react-native";
const { height } = Dimensions.get("window");

export const TablesRevision = ({ arr, setKeyboard }) => {
  return (
    <KeyboardAvoidingView
      behavior={"height"}
      // resetScrollToCoords={{ x: 0, y: 0 }}
      // scrollEnabled={false}
      // style={{ ...styles.parentFlatList, height }}
      style={styles.parentFlatList}
    >
      <View style={[styles.mainBlock, styles.more]}>
        <Text style={[styles.name, styles.moreText]}>Товар</Text>
        <Text style={[styles.price, styles.moreText]}>Цена</Text>
        <Text style={[styles.count, styles.moreText]}>Вналичии</Text>
        <Text style={[styles.count, styles.moreText]}>Возврат</Text>
      </View>
      <FlatList
        data={arr}
        renderItem={({ item, index }) => (
          <View style={styles.mainBlock} onPress={Keyboard.dismiss}>
            <Text style={styles.name}>
              {index + 1}. {item?.product_name}
            </Text>
            <Text style={styles.price}>{item?.price}</Text>
            <Text style={styles.count}>{item?.end_outcome}</Text>
            <View style={styles.input}>
              <CheckVes guidProduct={item?.guid} setKeyboard={setKeyboard} />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parentFlatList: {
    maxHeight: "75%",
    // maxHeight: "100%",
    // backgroundColor: "red",
  },

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
    width: "45%",
    // backgroundColor: "blue",
    paddingRight: 15,
  },

  price: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "13%",
    // backgroundColor: "yellow",
    paddingRight: 10,
    color: "green",
  },

  count: {
    fontSize: 13,
    fontWeight: "400",
    color: "#222",
    width: "19%",
    color: "green",
    // backgroundColor: "red",
  },

  input: {
    width: "18%",
  },
});
