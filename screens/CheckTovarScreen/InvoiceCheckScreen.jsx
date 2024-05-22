import { StyleSheet, Text, View } from "react-native";

////hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////fns
import { changeListActionLeftovers } from "../../store/reducers/requestSlice";
import { getLeftoversForCheck } from "../../store/reducers/requestSlice";
import { sendCheckListProduct } from "../../store/reducers/requestSlice";
import { changeActionsProducts } from "../../store/reducers/stateSlice";
import { clearActionsProducts } from "../../store/reducers/stateSlice";

///// components
import { ViewButton } from "../../customsTags/ViewButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import { changeLocalData } from "../../store/reducers/saveDataSlice";

///// helpers
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { totalSumReturns } from "../../helpers/amounts";
import { formatCount, unitResultFN } from "../../helpers/amounts";
import { TablesRevision } from "../Tables/TablesRevision";
import { ScrollView } from "react-native";

export const InvoiceCheckScreen = ({ route, navigation }) => {
  const { invoice_guid, guidWorkShop, seller_guid_to } = route.params;
  //// список товаров для ревизии

  const [keyboard, setKeyboard] = useState(false);

  const dispatch = useDispatch();

  const [modalSend, setModalSend] = useState(false);

  const { listActionLeftovers } = useSelector((state) => state.requestSlice);

  const { actionsProducts } = useSelector((state) => state.stateSlice);
  //// для ревизии списка товаров

  useEffect(() => {
    getData();

    return () => {
      dispatch(clearActionsProducts());
      dispatch(changeListActionLeftovers());
    };
    ///// очищаю список товаров, которые я отпрвляю для ревизии
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });

    const obj = { seller_guid: seller_guid_to, guidWorkShop };
    await dispatch(getLeftoversForCheck(obj));
    /// get остатки разделенные по цехам для ревизии
  };

  useEffect(() => {
    //////////////////////////////////////////////
    const products = listActionLeftovers?.map((i) => ({
      guid: i?.guid,
      price: i?.price,
      count: i?.end_outcome,
      unit_codeid: i?.unit_codeid,
    }));

    const newData = { ...actionsProducts, invoice_guid, products };

    dispatch(changeActionsProducts(newData)); //// сразу присваиваю guid накладной
  }, [listActionLeftovers]);

  const closeModal = () => setModalSend(false);

  const sendData = () => {
    dispatch(sendCheckListProduct({ actionsProducts, navigation }));
    closeModal();
  };

  const noneData = listActionLeftovers?.length === 0;

  const totals = unitResultFN(actionsProducts?.products);

  // console.log(keyboard, "keyboard");

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <TablesRevision arr={listActionLeftovers} setKeyboard={setKeyboard} />
        {!noneData && (
          <View style={styles.divAction}>
            <View style={styles.blockTotal}>
              <Text style={styles.totalItemCount}>
                Итого: {formatCount(+totals?.totalKg)} кг и{" "}
                {formatCount(+totals?.totalSht)} штук
              </Text>
              <Text style={styles.totalItemCount}>
                Сумма: {totalSumReturns(actionsProducts) || 0} сом
              </Text>
            </View>
          </View>
        )}
        {noneData ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <ViewButton
            styles={styles.sendBtn}
            onclick={() => setModalSend(true)}
          >
            Сформировать накладную
          </ViewButton>
        )}
      </View>
      <ConfirmationModal
        visible={modalSend}
        message="Сформировать накладную для ревизии товара ?"
        onYes={sendData}
        onNo={closeModal}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },

  container: {
    flex: 1,
    minWidth: "100%",
    marginBottom: 20,
    marginTop: 0,
    borderRadius: 8,
    paddingTop: 5,
  },

  head: { height: 60, backgroundColor: "rgba(199, 210, 254, 0.250)" },

  text: {
    margin: 4,
    marginBottom: 8,
    marginTop: 8,
    fontSize: 13,
  },

  rowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(199, 210, 254, 0.718)",
    paddingLeft: 2,
  },

  textTitle: {
    fontSize: 13,
    fontWeight: "500",
    paddingRight: 0,
    paddingLeft: 5,
    color: "#383838",
  },

  divAction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 5,
    width: "100%",
    paddingRight: 20,
    paddingLeft: 10,
    borderTopColor: "#222",
    borderTopWidth: 1,
  },

  blockTotal: {
    paddingTop: 10,
  },

  totalItemCount: {
    fontSize: 17,
    fontWeight: "500",
    color: "#222",
  },

  /////// checkbox
  standartBox: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "rgb(206 217 230)",
    borderRadius: 7,
    backgroundColor: "rgba(95, 230, 165, 0.99)",
  },
  standartBox__inner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    bottom: 3,
  },
  checkmark: {
    width: 15,
    height: 23,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
    transform: [{ rotate: "45deg" }],
  },
  /////// checkbox

  sendBtn: {
    fontSize: 16,
    color: "#fff",
    width: "95%",
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 10,
    fontWeight: 600,
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  /////////////////////////////////////

  delete: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  crossLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    borderRadius: 5,
    backgroundColor: "red",
    transform: [{ rotate: "45deg" }],
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
