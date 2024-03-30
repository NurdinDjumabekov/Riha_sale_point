import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptInvoiceTA,
  getMyEveryInvoice,
} from "../store/reducers/requestSlice";
import { Row, Rows, Table } from "react-native-table-component";
import { CheckBoxTable } from "../components/CheckBoxTable";
import ConfirmationModal from "../components/ConfirmationModal";
import { ViewCheckBox } from "../customsTags/ViewCheckBox";
import { ViewButton } from "../customsTags/ViewButton";
import { InputDifference } from "../components/InputDifference";
import { tranformDateDay } from "../helpers/tranformDateDay";

const Div = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 0px 10px;
`;

export const DetailedInvoice = () => {
  const [listData, setListData] = useState([]);

  const dispatch = useDispatch();
  const { everyInvoice } = useSelector((state) => state.requestSlice);
  const { acceptConfirmInvoice } = useSelector((state) => state.stateSlice);

  useEffect(() => {
    dispatch(getMyEveryInvoice(guid));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `Накладная №${everyInvoice?.codeid}`,
    });
    if (everyInvoice && everyInvoice.list) {
      const tableDataList = everyInvoice?.list?.map((item, index) => {
        return [`${item?.product_name}`, `${item?.change}`];
      });
      setListData(tableDataList);
    }
  }, [everyInvoice]);

  const windowWidth = Dimensions.get("window").width;
  const arrWidth = [50, 18, 12, 20]; //  проценты %

  // Преобразуем проценты в абсолютные значения ширины
  const resultWidths = arrWidth.map(
    (percentage) => (percentage / 100) * windowWidth
  );

  const isTrue = acceptConfirmInvoice?.products?.length == listData?.length;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Table>
          <Row
            data={[" Продукт", "Цена", "Вес", "Сумма"]}
            style={styles.head}
            textStyle={styles.textTitle}
            widthArr={resultWidths}
          />
          <Rows
            data={listData}
            textStyle={styles.text}
            widthArr={resultWidths}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "rgba(199, 210, 254, 0.718)",
              paddingLeft: 2,
            }}
          />
        </Table>
        {/* {isTrue && (
          <ViewButton styles={styles.sendBtn} onclick={clickOkay}>
            Принять накладную
          </ViewButton>
        )} */}
      </View>

      {/* <ConfirmationModal
        visible={modalVisibleOk}
        message="Принять накладную ?"
        onYes={changeModalApplication}
        onNo={() => setModalVisibleOk(false)}
        onClose={() => setModalVisibleOk(false)}
      /> */}
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
  head: { height: 60, backgroundColor: "rgba(199, 210, 254, 0.250)" },
  text: { margin: 6, marginBottom: 8, marginTop: 8 },
  textTitle: { margin: 6, fontSize: 16, fontWeight: 500 },

  titleDate: {
    fontSize: 20,
    // font-weight: 400;
    color: "#222",
  },
  textTitle: {
    fontSize: 15,
    // fontWeight: 500,
    paddingTop: 10,
    paddingRight: 0,
    paddingBottom: 15,
    paddingLeft: 5,
    color: "#383838",
  },
  divAction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 2,
    width: "100%",
    paddingRight: 20,
    marginTop: 10,
  },
  divAction__inner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    borderColor: "rgba(199, 210, 254, 0.718)",
    borderWidth: 1,
    borderRadius: 9,
    paddingBottom: 5,
  },
  sendBtn: {
    backgroundColor: "#c2f8e2",
    color: "#1ab782",
    width: "95%",
    alignSelf: "center",
    position: "absolute",
    bottom: -80,
  },
});
