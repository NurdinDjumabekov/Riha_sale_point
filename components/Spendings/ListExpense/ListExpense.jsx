///// hooks
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { FlatList, View, Text, RefreshControl } from "react-native";

////style
import styles from "./style";
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import { TouchableOpacity } from "react-native";
import { delExpenseTT } from "../../../store/reducers/requestSlice";

export const ListExpense = ({ getData }) => {
  const dispatch = useDispatch();

  const { preloader, listExpense } = useSelector((state) => state.requestSlice);
  const { seller_guid } = useSelector((state) => state.saveDataSlice.data);

  const [del, setDel] = useState(""); //// для модалки удаления расходов

  const emptyData = listExpense?.length == 0;

  const delSpending = () => {
    dispatch(delExpenseTT({ getData, seller_guid, del }));
    setDel("");
    ///// удаляю расходы через запрос
  };

  if (emptyData) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  const objType = {
    0: { text: "Ожидание", color: "red" },
    1: { text: "Отменено админом", color: "red" },
    2: { text: "Одобрено", color: "green" },
  };

  return (
    <>
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
                    {item?.comment ? item?.comment : "..."}
                  </Text>
                </View>
                <View style={styles.blockTitle}>
                  <Text style={styles?.[`${objType?.[+item?.status]?.color}`]}>
                    {objType?.[+item?.status]?.text}
                  </Text>
                  <Text style={styles.date}>{item?.date_system}</Text>
                  <Text style={styles.sum}>{item?.amount} сом</Text>
                </View>
              </View>
              {item?.cancel_comment && (
                <Text style={styles.commentAdmin}>{item?.cancel_comment}</Text>
              )}
              {+item?.status == 0 && (
                <TouchableOpacity
                  style={styles.krest}
                  onPress={() => setDel(item?.guid)}
                >
                  <View style={[styles.line, styles.deg]} />
                  <View style={[styles.line, styles.degMinus]} />
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item, index) => `${item?.guid}${index}`}
          refreshControl={
            <RefreshControl
              refreshing={preloader}
              onRefresh={() => getData()}
            />
          }
        />
      </View>
      <ConfirmationModal
        visible={!!del}
        message="Удалить ?"
        onYes={delSpending}
        onNo={() => setDel("")}
        onClose={() => setDel("")}
      />
    </>
  );
};
