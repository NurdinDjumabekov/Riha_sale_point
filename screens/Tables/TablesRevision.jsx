import React, { useRef, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import RevisionChangeCount from "../CheckTovarScreen/RevisionChangeCount";

export const TablesRevision = ({ arr }) => {
  const [objTemporary, setObjTemporary] = useState({});

  const inputRef = useRef(null);

  const addTenporaryData = (data) => {
    setObjTemporary(data);
    inputRef?.current?.focus();
    console.log(inputRef, "inputRef");
  };

  return (
    <>
      <View style={styles.parentFlatList}>
        <View style={[styles.mainBlock, styles.more]}>
          <Text style={[styles.name, styles.moreText]}>Товар</Text>
          <Text style={[styles.price, styles.moreText]}>Цена</Text>
          <Text style={[styles.count, styles.moreText]}>Вналичии</Text>
          <Text style={[styles.count, styles.moreText]}>Возврат</Text>
        </View>
        <FlatList
          data={arr}
          renderItem={({ item, index }) => (
            <View style={styles.mainBlock}>
              <Text style={styles.name}>
                {index + 1}. {item?.product_name}
              </Text>
              <Text style={styles.price}>{item?.price}</Text>
              <Text style={styles.count}>{item?.end_outcome}</Text>
              <TouchableOpacity
                style={styles.countReturn}
                onPress={() => addTenporaryData(item)}
              >
                <Text style={styles.countReturnText}>
                  {item?.change_end_outcome}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `${item.guid}${index}`}
        />
      </View>
      <RevisionChangeCount
        objTemporary={objTemporary}
        setObjTemporary={setObjTemporary}
        inputRef={inputRef}
      />
    </>
  );
};

const styles = StyleSheet.create({
  parentFlatList: {
    maxHeight: "75%",
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

  countReturn: {
    width: "19%",
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    paddingVertical: 5,
    paddingHorizontal: 3,
    // paddingTop: 5,
    borderRadius: 5,
  },

  countReturnText: {
    fontSize: 13,
    fontWeight: "400",
    color: "red",
  },

  input: {
    width: "18%",
  },
});
