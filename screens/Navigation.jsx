import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { LoginScreen } from "./LoginScreen/LoginScreen";
import { AllCategScreen } from "./AllCategScreen/AllCategScreen";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { AcceptInvoiceProdScreen } from "./MainInvoiceProdScreen/AcceptInvoiceProdScreen/AcceptInvoiceProdScreen";
import { SalePointScreen } from "./SaleScreen/SalePointScreen/SalePointScreen";
import { LogOut } from "../components/Header/LogOut";
import { LeftoversScreen } from "./LeftoversScreen/LeftoversScreen";
import { DetailedInvoiceProdScreen } from "./MainInvoiceProdScreen/DetailedInvoiceProdScreen/DetailedInvoiceProdScreen";
import { StoreSpendingScreen } from "./SpendingScreens/StoreSpendingScreen";
import { SoldProductScreen } from "./SaleScreen/SoldProductScreen/SoldProductScreen";
import { AcceptInvoiceHistoryScreen } from "./MainInvoiceProdScreen/AcceptInvoiceHistoryScreen/AcceptInvoiceHistoryScreen";
import { EveryInvoiceAcceptScreen } from "./MainInvoiceProdScreen/EveryInvoiceAcceptScreen/EveryInvoiceAcceptScreen";
import { PayMoneyScreen } from "./PayScreen/PayMoneyScreen";
import { HistoryBalance } from "./PayScreen/HistoryBalance";
import { SoputkaScreen } from "./SoputkaScreen/SoputkaScreen/SoputkaScreen";
import { AddProdSoputkaSrceen } from "./SoputkaScreen/AddProdSoputkaSrceen/AddProdSoputkaSrceen";
import { SoputkaProductScreen } from "./SoputkaScreen/SoputkaProductScreen/SoputkaProductScreen";
import { SoputkaProdHistoryScreen } from "./SoputkaScreen/SoputkaProdHistoryScreen/SoputkaProdHistoryScreen";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { Preloader } from "../components/Preloader";
import { CheckTovarScreen } from "./CheckTovarScreen/CheckTovarScreen";
import { InvoiceCheckScreen } from "./CheckTovarScreen/InvoiceCheckScreen";
import { ListCheckProdScreen } from "./CheckTovarScreen/ListCheckProdScreen";
import { EveryRevisionRequest } from "./CheckTovarScreen/EveryRevisionRequest";
import { RevisionRequest } from "./CheckTovarScreen/RevisionRequest";
import UserInfo from "../components/Header/UserInfo";
import SaleSearchScreen from "./SaleScreen/SaleSearchScreen/SaleSearchScreen";
import { MyReturnsScreen } from "./ReturnScreen/MyReturnsScreen";
import { DetailedInvoiceReturn } from "./ReturnScreen/DetailedInvoiceReturn";
import { AcceptReturnHistoryScreen } from "./ReturnScreen/AcceptReturnHistoryScreen";
import { EveryReturnScreen } from "./ReturnScreen/EveryReturnScreen";
import EverySaleProdScreen from "./SaleScreen/EverySaleProdScreen/EverySaleProdScreen";
import ScannerSaleScreen from "./SaleScreen/ScannerSaleScreen/ScannerSaleScreen";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.saveDataSlice);

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
              name="AllCategScreen"
              component={AllCategScreen}
              options={({ navigation }) => ({
                title: "",
                headerLeft: () => <UserInfo />,
                headerRight: () => <LogOut navigation={navigation} />,
              })}
            />
            {/* /////////////////////// принятие накладных  товара для продажи ////////////////////////*/}
            <Stack.Screen
              name="AcceptInvoiceProdScreen"
              component={AcceptInvoiceProdScreen}
              options={{ title: "Список накладных" }}
            />
            <Stack.Screen
              name="DetailedInvoiceProdScreen"
              component={DetailedInvoiceProdScreen}
              options={{ title: "Принятие накладной" }}
            />

            <Stack.Screen
              name="AcceptInvoiceHistoryScreen"
              component={AcceptInvoiceHistoryScreen}
              options={{ title: "Список принятых накладных" }}
            />
            <Stack.Screen
              name="EveryInvoiceAcceptScreen"
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

            {/* /////////////////////// Продажа /////////////////////////*/}
            <Stack.Screen
              name="SalePointScreen"
              component={SalePointScreen}
              options={{ title: "Продажи" }}
            />
            <Stack.Screen
              name="SaleSearchScreen"
              component={SaleSearchScreen}
              options={{ title: "" }}
              ////// поиск товаров для продажи
            />
            <Stack.Screen
              name="EverySaleProdScreen"
              component={EverySaleProdScreen}
              options={{ title: "Назад" }}
              ////// страница продажи каждого товара
            />
            <Stack.Screen
              name="SoldProductScreen"
              component={SoldProductScreen} /// список проданных товаров
              options={{ title: "Список продаж" }}
            />
            <Stack.Screen
              name="ScannerSaleScreen"
              component={ScannerSaleScreen}
              options={{ title: "Сканер" }}
              ////// сканер для продажи товара
            />

            {/* /////////////////////// Траты /////////////////////// */}
            <Stack.Screen
              name="Spending"
              component={StoreSpendingScreen}
              options={{ title: "Расходы" }}
            />
            {/* /////////////////////// 0плата ТТ && HistoryBalance /////////////////////// */}
            <Stack.Screen
              name="PayMoney"
              component={PayMoneyScreen}
              options={{ title: "Оплата" }}
            />
            <Stack.Screen
              name="HistoryBalance"
              component={HistoryBalance}
              options={{ title: "История баланса" }}
            />
            {/* /////////////////////// Возврат /////////////////////// */}
            <Stack.Screen
              name="MyReturnsScreen"
              component={MyReturnsScreen}
              options={{ title: "Возврат товара" }}
            />
            <Stack.Screen
              name="DetailedInvoiceReturn"
              component={DetailedInvoiceReturn}
              options={{ title: "Принятие накладной" }}
            />
            <Stack.Screen
              name="AcceptReturnHistoryScreen"
              component={AcceptReturnHistoryScreen}
              options={{ title: "Список накладных возврата" }}
            />
            <Stack.Screen
              name="EveryReturnScreen"
              component={EveryReturnScreen}
            />
            {/* /////////////////////// Ревизия /////////////////////// */}
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
      <StatusBar theme="auto" backgroundColor="rgba(47, 71, 190, 0.287)" />
    </NavigationContainer>
  );
};
