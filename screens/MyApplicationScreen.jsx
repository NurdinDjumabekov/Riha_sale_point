import { useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
} from "react-native";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyInvoice,
  changeListInvoices,
} from "../store/reducers/requestSlice";
import { EveryMyInvoice } from "../components/EveryMyInvoice";

export const MyApplicationScreen = ({ navigation, route }) => {
  /// загрузки
  const { preloader, listMyInvoice } = useSelector(
    (state) => state.requestSlice
  );
  const dispatch = useDispatch();

  const ParentDiv = styled.View`
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  `;

  const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  useEffect(() => {
    dispatch(getMyInvoice(seller_guid));
    return () => dispatch(changeListInvoices([]));
  }, []);

  // console.log(listMyInvoice, "listMyInvoice");
  return (
    <SafeAreaView>
      {listMyInvoice?.length === 0 ? (
        <Text style={styles.noneData}>Список пустой</Text>
      ) : (
        <ParentDiv>
          <FlatList
            contentContainerStyle={{
              minWidth: "100%",
              width: "100%",
            }}
            data={listMyInvoice}
            renderItem={({ item }) => (
              <EveryMyInvoice obj={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.guid}
            refreshControl={
              <RefreshControl
                refreshing={preloader}
                onRefresh={() => dispatch(getMyInvoice(seller_guid))}
              />
            }
          />
        </ParentDiv>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});
