import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/////tags
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";

/////components
import { AllHistoryInvoice } from "../common/AllHistoryInvoice";
import { ModalCreateSoputka } from "../components/Soputka/ModalCreateSoputka";
import { ViewButton } from "../customsTags/ViewButton";

/////redux
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { clearListCategory } from "../store/reducers/requestSlice";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { getHistorySoputka } from "../store/reducers/requestSlice";
import { getListAgents } from "../store/reducers/requestSlice";

/////helpers
import { getLocalDataUser } from "../helpers/returnDataUser";

export const SoputkaScreen = ({ navigation }) => {
  //// Сопутка
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);

  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listHistorySoputka } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    getData();

    return () => {
      dispatch(clearListCategory());
      dispatch(clearListProductTT());
      //// очищаю список категорий и товаров
    };
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getHistorySoputka(data?.seller_guid));
    await dispatch(getListAgents(data?.seller_guid));
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.soputkaBlock}>
          <ViewButton
            styles={styles.soputka}
            onclick={() => setModalState(true)}
          >
            + Создать накладную
          </ViewButton>
        </View>
        <View style={styles.selectBlock}>
          <Text style={styles.title}>История сопутки</Text>
          <FlatList
            data={listHistorySoputka}
            renderItem={({ item, index }) => (
              <AllHistoryInvoice
                item={item}
                index={index}
                keyLink={"SoputkaProdHistoryScreen"}
                navigation={navigation}
              />
            )}
            keyExtractor={(item) => item?.codeid}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
      </SafeAreaView>
      <ModalCreateSoputka
        modalState={modalState}
        setModalState={setModalState}
        navigation={navigation}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    padding: 12,
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    color: "#fff",
    marginBottom: 5,
  },

  everyPoint: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingBottom: 13,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activeCateg: {
    backgroundColor: "rgba(47, 71, 190, 0.672)",
    color: "#fff",
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(47, 71, 190, 0.272)",
    height: 15,
    width: 15,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    marginRight: 20,
  },

  activeArrow: {
    borderColor: "#fff",
  },

  selectBlock: {
    height: "88%",
  },

  soputkaBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: "100%",
  },

  soputka: {
    fontSize: 18,
    color: "#fff",
    minWidth: "95%",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 8,
    fontWeight: 600,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    marginTop: 20,
    marginBottom: 20,
  },

  everyProd: {
    padding: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(212, 223, 238, 0.47)",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.107)",
  },

  everyProdInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  blockTitle: {
    width: "67%",
  },

  blockTitleInner: {
    display: "flex",
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
  },

  titleNum: {
    fontSize: 19,
    fontWeight: "700",
    color: "rgba(47, 71, 190, 0.672)",
    borderColor: "rgba(47, 71, 190, 0.672)",
    borderWidth: 1,
    backgroundColor: "#d4dfee",
    padding: 4,
    paddingLeft: 7,
    paddingRight: 0,
    borderRadius: 5,
  },

  sum: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(12, 169, 70, 0.9)",
    lineHeight: 17,
  },

  date: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.687)",
    lineHeight: 22,
  },

  comment: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 5,
  },

  status: {
    paddingRight: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
  },

  good: {
    color: "rgba(12, 169, 70, 0.9)",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "left",
  },
  bad: { color: "red", fontSize: 12, fontWeight: "500", textAlign: "left" },
});
