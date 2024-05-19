import { useEffect, useState } from "react";
import { Row, Rows, Table } from "react-native-table-component";
import { Dimensions, ScrollView } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

///components
import ConfirmationModal from "../../components/ConfirmationModal";
import { ViewButton } from "../../customsTags/ViewButton";

///states
import { acceptInvoiceRevision } from "../../store/reducers/requestSlice";
import { getEveryRevisionRequest } from "../../store/reducers/requestSlice";

////helpers
import { listTableForAcceptInvoice } from "../../helpers/Data";

import styled from "styled-components/native";

export const EveryRevisionRequest = ({ route, navigation }) => {
  const { invoice_guid, disable } = route.params;

  const dispatch = useDispatch();

  const [listData, setListData] = useState([]);
  const [modalVisibleOk, setModalVisibleOk] = useState(false);

  const { everyRequestRevision } = useSelector((state) => state.requestSlice);

  const clickOkay = () => setModalVisibleOk(true);

  const sendData = () => {
    dispatch(acceptInvoiceRevision({ invoice_guid, navigation }));
    setModalVisibleOk(false);
  };

  useEffect(() => {
    dispatch(getEveryRevisionRequest(invoice_guid));
  }, [invoice_guid]);

  useEffect(() => {
    navigation.setOptions({
      title: `Накладная №${everyRequestRevision?.codeid}`,
    });
    if (everyRequestRevision && everyRequestRevision.list) {
      const newDataList = everyRequestRevision?.list?.map((item, index) => {
        return [
          `${index + 1}. ${item?.product_name}`,
          `${item?.product_price}`,
          `${item?.count}`,
        ];
      });
      setListData(newDataList);
    }
  }, [everyRequestRevision]);

  const windowWidth = Dimensions.get("window").width;
  const arrWidth = [60, 20, 20]; //  проценты %

  // Преобразуем проценты в абсолютные значения ширины
  const resultWidths = arrWidth.map(
    (percentage) => (percentage / 100) * windowWidth
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.parent}>
          <View style={styles.titleBlock}>
            <Text style={styles.titleDate}>{everyRequestRevision?.date}</Text>
          </View>
        </View>
        <Table>
          <Row
            data={listTableForAcceptInvoice}
            style={styles.head}
            textStyle={styles.textTitle}
            widthArr={resultWidths}
          />
          <Rows
            data={listData}
            textStyle={styles.text}
            widthArr={resultWidths}
            style={styled.rowStyle}
          />
        </Table>
        <View style={styles.divAction}>
          <View>
            <View style={styles.blockTotal}>
              <Text style={styles.totalItemCount}>
                Сумма: {everyRequestRevision?.total_price} сом
              </Text>
              <Text style={styles.totalItemCount}>
                Кол-во: {everyRequestRevision?.total_weight}
              </Text>
            </View>
          </View>
        </View>
        {!disable && (
          <ViewButton styles={styles.sendBtn} onclick={clickOkay}>
            Принять накладную
          </ViewButton>
        )}
      </View>
      <ConfirmationModal
        visible={modalVisibleOk}
        message="Принять накладную ревизии ?"
        onYes={sendData}
        onNo={() => setModalVisibleOk(false)}
        onClose={() => setModalVisibleOk(false)}
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
    marginTop: 10,
    borderRadius: 8,
    paddingBottom: 102,
    paddingTop: 5,
  },

  parent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginBottom: 5,
  },

  titleBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 0,
  },

  head: { height: 65, backgroundColor: "rgba(199, 210, 254, 0.250)" },

  text: {
    margin: 6,
    marginBottom: 8,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "400",
  },

  titleDate: {
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
  },

  textTitle: {
    fontSize: 15,
    fontWeight: "700",
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

  rowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(199, 210, 254, 0.718)",
    paddingLeft: 2,
  },

  totalItemCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
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
    backgroundColor: "rgba(97 ,100, 239,0.7)",
    color: "#fff",
    minWidth: "95%",
    alignSelf: "center",
  },
});
