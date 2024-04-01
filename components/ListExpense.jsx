import { StyleSheet, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";

export const ListExpense = ({ getData }) => {
  const dispatch = useDispatch();
  const { preloader, listExpense } = useSelector((state) => state.requestSlice);

  return (
    <View style={styles.parentBlock}>
      <FlatList
        contentContainerStyle={{
          width: "100%",
          paddingTop: 8,
        }}
        data={listExpense}
        renderItem={({ item }) => (
          <View style={styles.everyProd}>
            <View style={styles.everyProdInner}>
              <View style={styles.blockTitle}>
                <Text style={styles.title}>
                  {item?.seller_fio} ({item.name})
                </Text>
                <Text style={styles.comment}>
                  {item.comment === "" ? "..." : item.comment}
                </Text>
              </View>
              <View>
                <Text style={styles.date}>{item.date_system}</Text>
                <Text style={styles.sum}>{item.amount} сом</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.guid}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={() => getData()} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    minHeight: "100%",
    paddingBottom: 180,
  },
  everyProd: {
    padding: 15,
    // paddingVertical: 20,
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    marginBottom: 10,
    borderRadius: 6,
    // shadowColor: "#000",
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.107)",
  },
  everyProdInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },

  comment: {
    fontSize: 14,
    fontWeight: "400",
  },

  date: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(47, 71, 190, 0.687)",
  },

  sum: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(12, 169, 70, 0.9)",
  },

  blockTitle: { width: "60%" },
});
