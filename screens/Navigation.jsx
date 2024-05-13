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
import { ReturnProdScreen } from "./ReturnProdScreen";
import { EveryListInvoiceReturn } from "../components/ReturnProducts/EveryListInvoiceReturn";
import { HistoryBalance } from "./HistoryBalance";
import UserInfo from "../components/Header/UserInfo";
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

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.saveDataSlice);

  useEffect(() => {
    getLocalDataUser({ changeLocalData, dispatch });
  }, []);

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
            />

            <Stack.Screen
              name="SoputkaProdHistoryScreen"
              component={SoputkaProdHistoryScreen}
              options={{ title: "" }}
            />

            {/* /////////////////////// Остатки ///////////////////////*/}
            <Stack.Screen
              name="Leftovers"
              component={LeftoversScreen}
              options={{ title: "Остатки" }}
            />

            {/* /////////////////////// Продажа ///////////////////////*/}
            <Stack.Screen name="Shipment" component={MyShipmentScreen} />
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
              name="ReturnProd"
              component={ReturnProdScreen}
              options={{ title: "Накладная для возврата" }}
            />
            <Stack.Screen
              name="listReturnProd"
              component={EveryListInvoiceReturn}
            />

            {/* /////////////////////// CheckTovar /////////////////////// */}
            <Stack.Screen
              name="CheckTovarScreen"
              component={CheckTovarScreen}
              options={{ title: "Ревизия" }}
            />
            <Stack.Screen
              name="InvoiceCheckScreen"
              component={InvoiceCheckScreen}
              options={{ title: "Накладная для возврата" }}
            />

            <Stack.Screen
              name="ListCheckProdScreen"
              component={ListCheckProdScreen}
            />
          </>
        )}
      </Stack.Navigator>
      <StatusBar theme="auto" />
    </NavigationContainer>
  );
};
