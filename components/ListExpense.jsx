import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";

export const ListExpense = ({ getData }) => {
  const { preloader, listExpense } = useSelector((state) => state.requestSlice);

  const emptyData = listExpense?.length === 0;

  return (
    <>
      {emptyData ? (
        <Text style={styles.noneData}>Список пустой</Text>
      ) : (
        <View style={styles.parentBlock}>
          <FlatList
            contentContainerStyle={styles.flatlist}
            data={listExpense}
            renderItem={({ item }) => (
              <View style={styles.everyProd}>
                <View style={styles.everyProdInner}>
                  <View style={styles.blockTitle}>
                    <Text style={styles.title}>
                      {item?.seller_fio} ({item.name})
                    </Text>
                    <Text style={styles.comment}>
                      {item.comment ? item.comment : "..."}
                    </Text>
                  </View>
                  <View style={styles.blockTitle}>
                    <Text style={item?.status ? styles.noo : styles.good}>
                      {+item?.status === 1 ? "Отменено админом" : "Одобрено"}
                    </Text>
                    <Text style={styles.date}>{item.date_system}</Text>
                    <Text style={styles.sum}>{item.amount} сом</Text>
                  </View>
                </View>
                {item?.cancel_comment && (
                  <Text style={styles.commentAdmin}>
                    {item?.cancel_comment}
                  </Text>
                )}
              </View>
            )}
            keyExtractor={(item) => item.guid}
            refreshControl={
              <RefreshControl
                refreshing={preloader}
                onRefresh={() => getData()}
              />
            }
          />
        </View>
      )}
    </>
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
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    marginBottom: 10,
    borderRadius: 6,
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
    fontWeight: "400",
    color: "rgba(12, 169, 70, 0.9)",
  },

  blockTitle: { width: "60%" },

  flatlist: { width: "100%", paddingTop: 8 },
  good: { color: "rgba(12, 169, 70, 0.9)" },
  noo: { color: "red" },

  commentAdmin: {
    fontSize: 16,
    marginTop: 10,
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});
