import { SafeAreaView, FlatList, RefreshControl, View } from "react-native";
import styled from "styled-components/native";
import { ViewContainer } from "../customsTags/ViewContainer";
import { dataCategory } from "../helpers/Data";
import { EveryCategory } from "../components/EveryCategory";
import { useDispatch, useSelector } from "react-redux";
import { changePreloader } from "../store/reducers/requestSlice";

export const MainScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.saveDataSlice);
  const { preloader } = useSelector((state) => state.requestSlice);
  const dispatch = useDispatch();

  const ParentDiv = styled.View`
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px;
  `;

  const chnagePreloader = () => {
    dispatch(changePreloader(true));
    setTimeout(() => {
      dispatch(changePreloader(false));
    }, 1000);
  };

  // console.log(token, "tokenm");

  return (
    <View style={{ paddingTop: 20, backgroundColor: "#ebeef2" }}>
      <ViewContainer>
        <SafeAreaView>
          <ParentDiv>
            <FlatList
              contentContainerStyle={{
                minWidth: "100%",
                alignItems: "center",
                gap: 20,
                paddingBottom: 10,
              }}
              data={dataCategory}
              renderItem={({ item }) => (
                <EveryCategory obj={item} navigation={navigation} />
              )}
              // keyExtractor={(item) => item.codeid}
              numColumns={2}
              refreshControl={
                <RefreshControl
                  refreshing={preloader}
                  onRefresh={() => chnagePreloader()}
                />
              }
            />
          </ParentDiv>
        </SafeAreaView>
      </ViewContainer>
    </View>
  );
};
