import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyLeftovers,
  returnListProduct,
} from "../store/reducers/requestSlice";
import { ScrollView } from "react-native";
import { listTableForReturnProd } from "../helpers/Data";
import { Dimensions } from "react-native";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { CheckVes } from "../components/ReturnProducts/CheckVes";
import { changeReturnProd } from "../store/reducers/stateSlice";
import { ViewButton } from "../customsTags/ViewButton";
import ConfirmationModal from "../components/ConfirmationModal";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { totalCountReturns, totalSumReturns } from "../helpers/amounts";

export const ReturnProdScreen = ({ route, navigation }) => {
  const { invoice_guid } = route.params;
  //// возрат товара
  const dispatch = useDispatch();
  const [listData, setListData] = useState([]);
  const [modalSend, setModalSend] = useState(false);

  const { listLeftoversForReturn } = useSelector((state) => state.requestSlice);
  const { returnProducts } = useSelector((state) => state.stateSlice);
  const { data } = useSelector((state) => state.saveDataSlice);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getMyLeftovers(data?.seller_guid));
  };

  useEffect(() => {
    if (listLeftoversForReturn) {
      const tableDataList = listLeftoversForReturn?.map((item) => {
        return [
          `${item?.codeid}. ${item?.product_name}`,
          `${item?.price}`,
          `${item?.end_outcome}`,
          <CheckVes
            guidProduct={item?.product_guid}
            invoice_guid={invoice_guid}
          />,
        ];
      });
      setListData(tableDataList);
    }
    dispatch(
      changeReturnProd({
        ...returnProducts,
        invoice_guid,
        products: listLeftoversForReturn?.map((i) => {
          return {
            guid: i?.product_guid,
            price: i?.price,
            count: i?.end_outcome,
          };
        }),
      })
    ); //// сразу присваиваю guid накладной
  }, [listLeftoversForReturn]);

  const closeModal = () => setModalSend(false);

  const sendData = () => {
    // dispatch(returnListProduct({ data: returnProducts, navigation }));
    console.log(returnProducts, "returnProducts");
    // closeModal();
  };

  const windowWidth = Dimensions.get("window").width;
  const arrWidth = [47, 13, 20, 20]; //  проценты %
  // Преобразуем проценты в абсолютные значения ширины
  const resultWidths = arrWidth.map(
    (percentage) => (percentage / 100) * windowWidth
  );

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
        <View style={styles.divAction}>
          <View style={styles.blockTotal}>
            <Text style={styles.totalItemCount}>
              Сумма: {totalSumReturns(returnProducts) || 0} сом
            </Text>
            <Text style={styles.totalItemCount}>
              Кол-во: {totalCountReturns(returnProducts) || 0}
            </Text>
          </View>
        </View>
        {true && (
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
        message="Сформировать накладную для возврата товара ?"
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
    backgroundColor: "#fff",
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
});
