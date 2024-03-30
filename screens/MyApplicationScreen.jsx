import { useEffect } from "react";
import { SafeAreaView, FlatList, RefreshControl } from "react-native";
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

  const seller_guid = "93C7B683-048A-49D2-9E0A-23F31D563C23";

  useEffect(() => {
    dispatch(getMyInvoice(seller_guid));
    return () => dispatch(changeListInvoices([]));
  }, []);

  // console.log(listMyInvoice, "listMyInvoice");
  return (
    <SafeAreaView>
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
              onRefresh={() => dispatch(getMyInvoice({ obj: route?.params }))}
            />
          }
        />
      </ParentDiv>
    </SafeAreaView>
  );
};
