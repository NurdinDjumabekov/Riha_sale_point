import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { LoginScreen } from "./LoginScreen";
import { MainScreen } from "./MainScreen";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { MyApplicationScreen } from "./MyApplicationScreen";
import { MyShipmentScreen } from "./MyShipmentScreen";
import { LogOut } from "../components/Header/LogOut";
import { LeftoversScreen } from "./LeftoversScreen";
import { DetailedInvoice } from "./DetailedInvoice";
import { StoreSpendingScreen } from "./StoreSpendingScreen";
import { SoldProductScreen } from "./SoldProductScreen";
import { AcceptInvoiceHistory } from "../components/InvoiceTT/AcceptInvoiceHistory";
import { EveryInvoiceAcceptScreen } from "./EveryInvoiceAcceptScreen";
import { PayMoneyScreen } from "./PayMoneyScreen";
import { ReturnScreen } from "./ReturnScreen";
import { HistoryBalance } from "./HistoryBalance";
import { SoputkaScreen } from "./SoputkaScreen";
import { AddProdSoputkaSrceen } from "./AddProdSoputkaSrceen";
import { SoputkaProductScreen } from "./SoputkaProductScreen";
import { SoputkaProdHistoryScreen } from "./SoputkaProdHistoryScreen";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { Preloader } from "../components/Preloader";
import { CheckTovarScreen } from "./CheckTovarScreen/CheckTovarScreen";
import { InvoiceCheckScreen } from "./CheckTovarScreen/InvoiceCheckScreen";
import { ListCheckProdScreen } from "./CheckTovarScreen/ListCheckProdScreen";
import { EveryRevisionRequest } from "./CheckTovarScreen/EveryRevisionRequest";
import { RevisionRequest } from "./CheckTovarScreen/RevisionRequest";
import { AddProdReturnSrceen } from "./AddProdReturnSrceen";
import UserInfo from "../components/Header/UserInfo";
import { ReturnProductScreen } from "./ReturnProductScreen";
import { ReturnProdHistoryScreen } from "./ReturnProdHistoryScreen";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.saveDataSlice);

  // console.log(data, "data");

  useEffect(() => getLocalDataUser({ changeLocalData, dispatch }), []);

  const checkLogin = !data?.seller_guid;

  return (
    <NavigationContainer>
      <Preloader />
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: "#fff" } }}
      >
        {checkLogin ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {/* /////////////////////// Главная страница ///////////////////////*/}
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={({ navigation }) => ({
                title: "",
                headerLeft: () => <UserInfo />,
                headerRight: () => <LogOut navigation={navigation} />,
              })}
            />

            {/* /////////////////////// HistoryBalance ///////////////////////*/}
            <Stack.Screen
              name="HistoryBalance"
              component={HistoryBalance}
              options={{ title: "История баланса" }}
            />

            {/* /////////////////////// Main ///////////////////////*/}
            <Stack.Screen
              name="Application"
              component={MyApplicationScreen}
              options={{ title: "Список накладных" }}
            />

            <Stack.Screen name="detailedInvoice" component={DetailedInvoice} />

            <Stack.Screen
              name="InvoiceHistory"
              component={AcceptInvoiceHistory}
              options={{ title: "Список принятых накладных" }}
            />

            <Stack.Screen
              name="EveryInvoiceHistory"
              component={EveryInvoiceAcceptScreen}
            />

            {/* /////////////////////// Сопутка ///////////////////////*/}
            <Stack.Screen
              name="Soputka"
              component={SoputkaScreen}
              options={{ title: "Сопутка" }}
            />

            <Stack.Screen
              name="AddProdSoputkaSrceen"
              component={AddProdSoputkaSrceen}
              options={{ title: "" }}
            />

            <Stack.Screen
              name="SoputkaProductScreen"
              component={SoputkaProductScreen}
              options={{ title: "Сопутствующие товары" }}
              ////// список сопутствующих товаров
            />

            <Stack.Screen
              name="SoputkaProdHistoryScreen"
              component={SoputkaProdHistoryScreen}
              ////// просмотр каждой истории сопутки
            />

            {/* /////////////////////// Остатки ///////////////////////*/}
            <Stack.Screen
              name="Leftovers"
              component={LeftoversScreen}
              options={{ title: "Остатки" }}
            />

            {/* /////////////////////// Продажа ///////////////////////*/}
            <Stack.Screen
              name="Shipment"
              component={MyShipmentScreen}
              options={{ title: "Продажи" }}
            />

            <Stack.Screen
              name="SoldProduct"
              component={SoldProductScreen} /// список проданных товаров
              options={{ title: "Список продаж" }}
            />

            {/* /////////////////////// Траты /////////////////////// */}
            <Stack.Screen
              name="Spending"
              component={StoreSpendingScreen}
              options={{ title: "Расходы" }}
            />

            {/* /////////////////////// 0плата ТТ /////////////////////// */}
            <Stack.Screen
              name="PayMoney"
              component={PayMoneyScreen}
              options={{ title: "Оплата" }}
            />

            {/* /////////////////////// ReturnScreen /////////////////////// */}
            <Stack.Screen
              name="ReturnInvoice"
              component={ReturnScreen}
              options={{ title: "Возврат товара" }}
            />

            <Stack.Screen
              name="AddProdReturnSrceen"
              component={AddProdReturnSrceen}
              options={{ title: "" }}
            />

            <Stack.Screen
              name="ReturnProductScreen"
              component={ReturnProductScreen}
              options={{ title: "Товары для возврата" }}
              ////// список товаров для возврата
            />

            <Stack.Screen
              name="ReturnProdHistoryScreen"
              component={ReturnProdHistoryScreen}
              ////// просмотр каждой истории возврата накладной
            />

            {/* /////////////////////// CheckTovar /////////////////////// */}

            <Stack.Screen
              name="CheckTovarScreen"
              component={CheckTovarScreen}
              options={{ title: "Ревизия" }}
              ////// выбор продавца и сипсок истории
            />

            <Stack.Screen
              name="InvoiceCheckScreen"
              component={InvoiceCheckScreen}
              options={{ title: "Накладная для ревизии" }}
            />

            <Stack.Screen
              name="RevisionRequest"
              component={RevisionRequest}
              options={{ title: "Список запросов на ревизию" }}
              ////// список запрос0в других пр0давцов для подтверждения ревизии
            />

            <Stack.Screen
              name="EveryRevisionRequest"
              component={EveryRevisionRequest}
              options={{ title: "" }}
              ////// каждый запрос других пр0давцов для подтверждения ревизии
            />

            <Stack.Screen
              name="ListCheckProdScreen"
              component={ListCheckProdScreen}
              options={{ title: "" }}
            />
          </>
        )}
      </Stack.Navigator>
      <StatusBar theme="auto" />
    </NavigationContainer>
  );
};
