import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { EveryProduct } from "../components/EveryProduct";
import { ViewButton } from "../customsTags/ViewButton";
import { changeListProductForTT } from "../store/reducers/stateSlice";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  addProdInvoiceTT,
  getCategoryTT,
} from "../store/reducers/requestSlice";

export const EveryInvoiceList = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { codeid, guid } = route.params;
  const [modal, setModal] = useState(false);
  const { listProductForTT } = useSelector((state) => state.stateSlice);

  const agent_guid = "B3120F36-3FCD-4CA0-8346-484881974846";

  useEffect(() => {
    // getData();
    navigation.setOptions({
      title: `Накладная №${codeid}`,
    });

    // return () => dispatch(changeTemporaryData({})); /// очищаю временный state
  }, [guid]);

  const getData = async () => {
    await dispatch(getCategoryTT(agent_guid));
    await dispatch(
      getProductTA({
        guid: "0",
        agent_guid: agent_guid,
      })
    ); /// 0 - все продукты
    dispatch(changeListProductForTT([]));
  };

  const sendData = () => {
    const data = {
      invoice_guid: guid,
      products: listProductForTT?.map((i) => {
        return {
          guid: i.guid,
          count: i.ves,
          price: i.price,
        };
      }),
    };
    dispatch(addProdInvoiceTT({ data, navigation }));
    setModal(false);
  };

  // console.log(listProductForTT, "listProductForTT");

  const totalSum = listProductForTT.reduce((total, item) => {
    return +item.price * +item.ves + total;
  }, 0);

  const widthMax = { minWidth: "100%", width: "100%" };
  const noneData = listProductForTT?.length === 0;
  return (
    <>
      <View style={styles.container}>
        {noneData ? (
          <Text style={styles.noneData}>Список пустой </Text>
        ) : (
          <SafeAreaView>
            <FlatList
              contentContainerStyle={widthMax}
              data={listProductForTT}
              renderItem={({ item, index }) => (
                <EveryProduct obj={item} index={index} type="simpleList" />
              )}
              keyExtractor={(item, ind) => `${item.guid}${ind}`}
            />
            <Text style={styles.resultSum}>Итого: {totalSum} сом</Text>
            {!noneData && (
              <ViewButton
                styles={styles.sendBtn}
                onclick={() => setModal(true)}
              >
                Подтвердить
              </ViewButton>
            )}
          </SafeAreaView>
        )}
      </View>
      {/* /// для подтверждения отправки */}
      <ConfirmationModal
        visible={modal}
        message="Подтвердить ?"
        onYes={sendData}
        onNo={() => setModal(false)}
        onClose={() => setModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d4dfee",
    padding: 10,
    paddingRight: 0,
    paddingLeft: 0,
  },
  noneData: {
    flex: 1,
    paddingTop: 300,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
  sendBtn: {
    backgroundColor: "rgba(95, 230, 165, 0.99)",
    color: "#fff",
    // marginTop: 20,
    width: "95%",
    alignSelf: "center",
  },

  resultSum: {
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    // color: "rgba(47, 71, 190, 0.891)",
    textAlign: "right",
    padding: 20,
  },
});
