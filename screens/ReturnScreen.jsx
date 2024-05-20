import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";

//////components
import { ViewButton } from "../customsTags/ViewButton";
import { ModalCreateReturn } from "../components/Return/ModalCreateReturn";
import { AllHistoryInvoice } from "../common/AllHistoryInvoice";

/////redux
import { getHistoryReturn } from "../store/reducers/requestSlice";
import { clearListCategory } from "../store/reducers/requestSlice";
import { clearListProductTT } from "../store/reducers/requestSlice";
import { getListAgents } from "../store/reducers/requestSlice";
import { changeLocalData } from "../store/reducers/saveDataSlice";

/////helpers
import { getLocalDataUser } from "../helpers/returnDataUser";

export const ReturnScreen = ({ navigation }) => {
  //// возврат накладной
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);

  const { data } = useSelector((state) => state.saveDataSlice);

  const { preloader, listHistoryReturn } = useSelector(
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
    await dispatch(getHistoryReturn(data?.seller_guid));
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
            + Создать накладную для возврата
          </ViewButton>
        </View>
        <View style={styles.selectBlock}>
          <Text style={styles.title}>История возврата</Text>
          <FlatList
            data={listHistoryReturn}
            renderItem={({ item, index }) => (
              <AllHistoryInvoice
                item={item}
                index={index}
                keyLink={"ReturnProdHistoryScreen"}
                navigation={navigation}
              />
            )}
            keyExtractor={(item, index) => `${item?.codeid}${index}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
      </SafeAreaView>
      <ModalCreateReturn
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
});
