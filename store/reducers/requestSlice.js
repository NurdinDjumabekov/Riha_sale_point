import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../env";
import {
  addListProductForTT,
  changeAcceptInvoiceTA,
  changeListProductForTT,
  changeTemporaryData,
  clearDataInputsInv,
  clearLogin,
} from "./stateSlice";
import { changeToken } from "./saveDataSlice";
import { Alert } from "react-native";

const initialState = {
  preloader: false,
  chech: "",
  listMyInvoice: [],
  everyInvoice: {},
  listSellersPoints: [],
  listCategoryTA: [], //  список категорий ТА
  listProductTA: [], //  список продуктов ТА (cписок прод-тов отсортированные селектами)
  listLeftovers: [], // список остатков
  listInvoiceEveryTA: [], /// список накладных каждого ТА(типо истории)
  listProductEveryInvoiceTA: [], /// список товаров каждой накладной ТА(типо истории)

  listComming: [],
  listSelectCategory: [],
};

/// logInAccount
export const logInAccount = createAsyncThunk(
  "logInAccount",
  async function (info, { dispatch, rejectWithValue }) {
    const { login, password, navigation } = info;
    dispatch(changePreloader(true));
    setTimeout(() => {
      dispatch(changeToken(login));
      navigation.navigate("Main");
      dispatch(changePreloader(false));
      dispatch(clearLogin());
    }, 500);
    try {
      const response = await axios({
        method: "POST",
        url: ``,
        data: {
          login,
          password,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        // return response?.data?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getMyInvoice
export const getMyInvoice = createAsyncThunk(
  "getMyInvoice",
  /// для получения всех накладных
  async function (seller_guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoices?seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getMyEveryInvoice
export const getMyEveryInvoice = createAsyncThunk(
  "getMyEveryInvoice",
  /// для получения каждой накладной
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_invoice?invoice_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        const data = response?.data?.[0];
        // console.log(data, "sadas");
        dispatch(
          changeAcceptInvoiceTA({
            invoice_guid: data?.guid,
            products: data?.list?.map((i) => {
              return {
                guid: i?.guid,
                is_checked: false,
                change: i?.count,
              };
            }),
          })
        );
        return data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// acceptInvoiceTA
export const acceptInvoiceTA = createAsyncThunk(
  "acceptInvoiceTA",
  /// для принятия накладной торговой точкой
  async function ({ data, navigation }, { rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/point_conf_inv`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        navigation.navigate("Main");
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getCategoryTT
export const getCategoryTT = createAsyncThunk(
  "getCategoryTT",
  /// для получения списка точек (магазинов)
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_category?seller_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getMyLeftovers
export const getMyLeftovers = createAsyncThunk(
  "getMyLeftovers",
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_report_leftovers?seller_guid=${guid}`, /// тут есть еще search и category
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// createInvoiceTT
export const createInvoiceTT = createAsyncThunk(
  "createInvoiceTT",
  /// создание накладной торговый точкой
  async function ({ data, navigation }, { rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        navigation.navigate("everyInvoice", {
          codeid: response?.data?.codeid,
          guid: response?.data?.guid,
        });
        // console.log(response.data, "response");
        // setTimeout(() => {
        //   navigation.navigate("everyInvoice", {
        //     codeid: response?.data?.codeid,
        //     guid: response?.data?.guid,
        //   });
        // }, 200);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
//////////////////////////////////////////////////////////////

/// getAllSellersPoint
/// delete
export const getAllSellersPoint = createAsyncThunk(
  "getAllSellersPoint",
  /// для получения списка точек (магазинов)
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/ta/get_points?agent_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        console.log(response?.data, "444");
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getProductTA
export const getProductTA = createAsyncThunk(
  "getProductTA",
  /// для получения списка точек (магазинов)
  async function ({ guid, seller_guid }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_product?categ_guid=${guid}&seller_guid=${seller_guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        console.log(response?.data, "response?.data");
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// addProdInvoiceTT
export const addProdInvoiceTT = createAsyncThunk(
  "addProdInvoiceTT",
  /// Отправка накладной с товарами для ТТ от ТА
  async function ({ data, navigation }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/ta/create_invoice_products`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(changeListProductForTT([])); /// очищаю список , где лежат данные для отправки ТТ
        navigation.navigate("Main");
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// addProductInvoiceTT
export const addProductInvoiceTT = createAsyncThunk(
  /// добавление продукта(по одному) в накладную торговой точки
  "addProductInvoiceTT",
  async function (info, { dispatch, rejectWithValue }) {
    const { data, getData } = info;
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/create_invoice_product`,
        data,
      });
      if (response.status >= 200 && response.status < 300) {
        dispatch(clearDataInputsInv());
        dispatch(changeTemporaryData({}));
        setTimeout(() => {
          // getData();
        }, 500);
        return response?.data?.result;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//////////////////////////////////////////////////////////////

/// getInvoiceEveryTA
/// список накладных каждого ТА(типо истории)
export const getInvoiceEveryTA = createAsyncThunk(
  "getInvoiceEveryTA",
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/ta/get_agent_invoice?agent_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data,"response?.data");
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getProductEveryInvoice
/// список товароы каждой накладной ТА(типо истории)
export const getProductEveryInvoice = createAsyncThunk(
  "getProductEveryInvoice",
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/ta/get_agent__invoice_product?invoice_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data?.[0]?.list, "response?.data");
        return response?.data?.[0]?.list;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// checkProductLeftovers
/// проверяю продукт на его кол-во, если кол-во есть,
/// то добавляю в список , а если не т, то выводится alert
export const checkProductLeftovers = createAsyncThunk(
  "checkProductLeftovers",
  async function (info, { dispatch, rejectWithValue }) {
    // dispatch(changePreloader(true));
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/ta/check_product_leftover`,
        data: {
          product_guid: info?.productGuid,
          count: info?.ves,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        console.log(response?.data?.result);
        const check = response?.data?.result; /// 1 - успешный, 0 - неуспешный
        if (+check == 1) {
          dispatch(addListProductForTT(info));
          dispatch(clearDataInputsInv());
          dispatch(changeTemporaryData({}));
          Alert.alert("Товар добавлен в накладную");
          dispatch(changePreloader(false));
        } else {
          Alert.alert(
            "Ошибка!",
            "Введенное количество товара больше доступного количества. Пожалуйста, введите корректное количество."
          );
          dispatch(changePreloader(false));
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const requestSlice = createSlice({
  name: "requestSlice",
  initialState,
  extraReducers: (builder) => {
    //// logInAccount
    builder.addCase(logInAccount.fulfilled, (state, action) => {
      state.preloader = false;
      state.chech = action.payload;
    });
    builder.addCase(logInAccount.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(logInAccount.pending, (state, action) => {
      state.preloader = true;
    });
    //// getMyInvoice
    builder.addCase(getMyInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.listMyInvoice = action.payload;
    });
    builder.addCase(getMyInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getMyInvoice.pending, (state, action) => {
      state.preloader = true;
    });
    //// getMyEveryInvoice
    builder.addCase(getMyEveryInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.everyInvoice = action.payload;
    });
    builder.addCase(getMyEveryInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getMyEveryInvoice.pending, (state, action) => {
      state.preloader = true;
    });
    ///// acceptInvoiceTA
    builder.addCase(acceptInvoiceTA.fulfilled, (state, action) => {
      state.preloader = false;
      Alert.alert("Принято!");
    });
    builder.addCase(acceptInvoiceTA.rejected, (state, action) => {
      state.error = action.payload;
      Alert.alert("Упс, что-то пошло не так!");
      state.preloader = false;
    });
    builder.addCase(acceptInvoiceTA.pending, (state, action) => {
      state.preloader = true;
    });
    ///// getAllSellersPoint
    builder.addCase(getAllSellersPoint.fulfilled, (state, action) => {
      state.preloader = false;
      state.listSellersPoints = action.payload?.map(
        ({ name, seller_guid, seller_fio }) => ({
          label: `${name}, ${seller_fio}`,
          value: seller_guid,
        })
      );
    });
    /// [ { label: "Колбаса ", value: "********************************" },]
    builder.addCase(getAllSellersPoint.rejected, (state, action) => {
      state.error = action.payload;
      Alert.alert("Упс, что-то пошло не так!");
      state.preloader = false;
    });
    builder.addCase(getAllSellersPoint.pending, (state, action) => {
      state.preloader = true;
    });
    //// createInvoiceTT
    builder.addCase(createInvoiceTT.fulfilled, (state, action) => {
      state.preloader = false;
      Alert.alert("Касса открыта!");
    });
    builder.addCase(createInvoiceTT.rejected, (state, action) => {
      state.error = action.payload;
      Alert.alert("Упс, что-то пошло не так! Не удалось открыть кассу");
      state.preloader = false;
    });
    builder.addCase(createInvoiceTT.pending, (state, action) => {
      state.preloader = true;
    });
    /////// getCategoryTT
    builder.addCase(getCategoryTT.fulfilled, (state, action) => {
      state.preloader = false;
      state.listCategoryTA = action?.payload?.map(
        ({ category_name, category_guid }, ind) => ({
          label: `${ind + 2}. ${category_name}`,
          value: category_guid,
        })
      );

      // Добавляем категорию "Все" в начало массива
      state.listCategoryTA.unshift({
        label: "1. Все",
        value: "0", // Здесь может быть уникальное значение для категории "Все"
      });
    });
    builder.addCase(getCategoryTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getCategoryTT.pending, (state, action) => {
      state.preloader = true;
    });
    ////// getProductTA
    builder.addCase(getProductTA.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProductTA = action.payload;
    });
    builder.addCase(getProductTA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getProductTA.pending, (state, action) => {
      state.preloader = true;
    });
    //////// addProdInvoiceTT
    builder.addCase(addProdInvoiceTT.fulfilled, (state, action) => {
      state.preloader = false;
      Alert.alert("Товар был успешно передан!");
    });
    builder.addCase(addProdInvoiceTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось передать товар");
    });
    builder.addCase(addProdInvoiceTT.pending, (state, action) => {
      state.preloader = true;
    });
    //////// getMyLeftovers
    builder.addCase(getMyLeftovers.fulfilled, (state, action) => {
      state.preloader = false;
      state.listLeftovers = action.payload?.map((item, ind) => [
        `${ind + 1}. ${item.product_name}`,
        `${item.start_outcome}`,
        `${item.income}`,
        `${item.outcome}`,
        `${item.end_outcome}`,
      ]);
    });
    builder.addCase(getMyLeftovers.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getMyLeftovers.pending, (state, action) => {
      state.preloader = true;
    });
    ////// getInvoiceEveryTA
    builder.addCase(getInvoiceEveryTA.fulfilled, (state, action) => {
      state.preloader = false;
      state.listInvoiceEveryTA = action.payload;
    });
    builder.addCase(getInvoiceEveryTA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getInvoiceEveryTA.pending, (state, action) => {
      state.preloader = true;
    });
    ////// getProductEveryInvoice
    builder.addCase(getProductEveryInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProductEveryInvoiceTA = action.payload;
    });
    builder.addCase(getProductEveryInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getProductEveryInvoice.pending, (state, action) => {
      state.preloader = true;
    });
    /////// addProductInvoiceTT
    builder.addCase(addProductInvoiceTT.fulfilled, (state, action) => {
      /// 0 - error
      /// 1 - продукт добавлен
      /// 2 - Введенное количество товара больше доступного количества.
      state.preloader = false;
      +action.payload === 1
        ? Alert.alert("Товар успешно добавлен!")
        : Alert.alert(
            "Ошибка!",
            "Введенное количество товара больше доступного количества. Пожалуйста, введите корректное количество или вес"
          );
    });
    builder.addCase(addProductInvoiceTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(addProductInvoiceTT.pending, (state, action) => {
      state.preloader = true;
    });
  },

  reducers: {
    changePreloader: (state, action) => {
      state.preloader = action.payload;
    },
    changeListInvoices: (state, action) => {
      state.listMyInvoice = action.payload;
    },
    changeComming: (state, action) => {
      state.listComming = action.payload;
    },
    changeLeftovers: (state, action) => {
      state.listLeftovers = action.payload;
    },
    changeListSellersPoints: (state, action) => {
      state.listSellersPoints = action.payload;
    },
  },
});
export const {
  changePreloader,
  changeListInvoices,
  changeComming,
  changeLeftovers,
  changeListSellersPoints,
} = requestSlice.actions;

export default requestSlice.reducer;
