import { FlatList, View, Text, RefreshControl } from "react-native";

import { useSelector } from "react-redux";

////style
import styles from "./style";

export const ListExpense = ({ getData }) => {
  const { preloader, listExpense } = useSelector((state) => state.requestSlice);

  const emptyData = listExpense?.length === 0;

  if (emptyData) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  const objType = {
    0: { text: "Ожидание", color: "red" },
    1: { text: "Отменено админом", color: "red" },
    2: { text: "Одобрено", color: "green" },
  };

  return (
    <View style={styles.parentBlock}>
      <FlatList
        contentContainerStyle={styles.flatlist}
        data={listExpense}
        renderItem={({ item }) => (
          <View style={styles.everyProd}>
            <View style={styles.everyProdInner}>
              <View style={styles.blockTitle}>
                <Text style={styles.title}>{item?.name}</Text>
                <Text style={styles.comment}>
                  {item.comment ? item.comment : "..."}
                </Text>
              </View>
              <View style={styles.blockTitle}>
                <Text style={styles?.[`${objType?.[+item?.status]?.color}`]}>
                  {objType?.[+item?.status]?.text}
                </Text>
                <Text style={styles.date}>{item.date_system}</Text>
                <Text style={styles.sum}>{item.amount} сом</Text>
              </View>
            </View>
            {item?.cancel_comment && (
              <Text style={styles.commentAdmin}>{item?.cancel_comment}</Text>
            )}
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={() => getData()} />
        }
      />
    </View>
  );
};
