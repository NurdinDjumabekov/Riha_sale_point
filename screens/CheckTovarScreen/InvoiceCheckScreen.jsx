import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  changeListActionLeftovers,
  getLeftoversForCheck,
} from "../../store/reducers/requestSlice";
import { sendCheckListProduct } from "../../store/reducers/requestSlice";
import { ScrollView } from "react-native";
import { Dimensions } from "react-native";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { changeActionsProducts } from "../../store/reducers/stateSlice";
import { clearActionsProducts } from "../../store/reducers/stateSlice";

import { ViewButton } from "../../customsTags/ViewButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import { changeLocalData } from "../../store/reducers/saveDataSlice";

///// helpers
import { listTableForReturnProd } from "../../helpers/Data";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import {
  formatCount,
  totalSumReturns,
  unitResultFN,
} from "../../helpers/amounts";
import { CheckVes } from "../../components/CheckProd/CheckVes";

export const InvoiceCheckScreen = ({ route, navigation }) => {
  const { invoice_guid, guidWorkShop, seller_guid_to } = route.params;
  //// список товаров для ревизии

  const dispatch = useDispatch();

  const [listData, setListData] = useState([]);
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

    // const obj = { seller_guid: data?.seller_guid, guidWorkShop };
    const obj = { seller_guid: seller_guid_to, guidWorkShop };
    await dispatch(getLeftoversForCheck(obj));
    /// get остатки разделенные по цехам для ревизии
  };

  useEffect(() => {
    if (listActionLeftovers) {
      const tableDataList = listActionLeftovers?.map((item, index) => {
        return [
          `${index + 1}. ${item?.product_name}`,
          // `${item?.sale_price}`,
          `${item?.price}`,
          `${item?.end_outcome}  ${item?.unit}`,
          <CheckVes guidProduct={item?.guid} />,
        ];
      });
      setListData(tableDataList);
    }

    //////////////////////////////////////////////
    const products = listActionLeftovers?.map((i) => ({
      guid: i?.guid,
      // price: i?.sale_price,
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

  const windowWidth = Dimensions.get("window").width;
  const arrWidth = [47, 13, 20, 20]; //  проценты %
  // Преобразуем проценты в абсолютные значения ширины

  const resultWidths = arrWidth.map(
    (percentage) => (percentage / 100) * windowWidth
  );

  const noneData = listData?.length === 0;

  const totals = unitResultFN(actionsProducts?.products);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Table>
          <Row
            data={listTableForReturnProd}
            style={styles.head}
            textStyle={styles.textTitle}
            widthArr={resultWidths}
          />
          <TableWrapper>
            <Rows
              data={listData?.map((item) => [
                item[0], // Продукт
                <Text style={{ ...styles.text, color: "green", marginLeft: 8 }}>
                  {item[1]}
                </Text>, // Цена
                <Text style={{ ...styles.text, color: "green", marginLeft: 8 }}>
                  {item[2]}
                </Text>, // В наличии
                item[3], // Возврат
                item[4], // ....
              ])}
              textStyle={styles.text}
              widthArr={resultWidths}
              style={styles.rowStyle}
            />
          </TableWrapper>
        </Table>
        {!noneData && (
          <View style={styles.divAction}>
            <View style={styles.blockTotal}>
              <Text style={styles.totalItemCount}>
                Итого: {formatCount(totals?.totalKg)} кг и{" "}
                {formatCount(totals?.totalSht)} штук
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "100%",
    marginBottom: 20,
    marginTop: 0,
    borderRadius: 8,
    paddingBottom: 102,
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
    marginTop: 10,
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
    paddingTop: 10,
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
