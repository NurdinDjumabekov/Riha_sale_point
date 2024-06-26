/////// hooks
import React, { useRef, useState } from "react";

////// tags
import { FlatList, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";

/////// components
import RevisionChangeCount from "../../../components/CheckProd/RevisionChangeCount/RevisionChangeCount";

export const TablesRevision = ({ arr }) => {
  const [objTemporary, setObjTemporary] = useState({});

  const inputRef = useRef(null);

  const addTenporaryData = (data) => {
    setObjTemporary(data);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 1000);
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
