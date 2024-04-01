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
import { transformDate } from "../../helpers/transformDate";

const initialState = {
  preloader: false,
  chech: "",
  listMyInvoice: [],
  everyInvoice: {},
  listSellersPoints: [],
  listCategoryTA: [], //  список категорий ТА
  listProductTA: [], //  список продуктов ТА (cписок прод-тов отсортированные селектами)
  listLeftovers: [], // список остатков
  listInvoiceEveryTT: [], /// список накладных каждой ТТ(типо истории)
  historyEveryInvoice: {
    list: [],
    status: 0,
  }, /// список товаров каждой накладной ТT(типо истории)
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
          date: transformDate(new Date()),
        });
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
        // console.log(response?.data, "response?.data");
        return response?.data;
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
        console.log(data, "data5555");
        +response?.data?.result === 1 &&
          setTimeout(() => {
            getData();
          }, 500);
        // console.log(response?.data?.result,"response?.data?.result");
        return response?.data?.result;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// getInvoiceEveryTT
/// список накладных каждой ТT(типо истории)
export const getInvoiceEveryTT = createAsyncThunk(
  "getInvoiceEveryTT",
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_point_invoice?seller_guid=${guid}`,
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

/// getProductEveryInvoice
/// список товаров каждой накладной ТT(типо истории)
export const getProductEveryInvoice = createAsyncThunk(
  "getProductEveryInvoice",
  async function (guid, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "GET",
        url: `${API}/tt/get_point_invoice_product?invoice_guid=${guid}`,
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data?.[0], "response?.data");
        return response?.data?.[0];
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/// closeKassa
/// список товаров каждой накладной ТT(типо истории)
export const closeKassa = createAsyncThunk(
  "closeKassa",
  async function ({ guid, navigation }, { dispatch, rejectWithValue }) {
    try {
      const response = await axios({
        method: "POST",
        url: `${API}/tt/shift_end_invoice`,
        data: { invoice_guid: guid },
      });
      if (response.status >= 200 && response.status < 300) {
        // console.log(response?.data, "response?.data");
        setTimeout(() => {
          navigation.navigate("Main");
        }, 500);
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//////////////////////////////////////////////////////////////
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
    ////// getInvoiceEveryTT
    builder.addCase(getInvoiceEveryTT.fulfilled, (state, action) => {
      state.preloader = false;
      state.listInvoiceEveryTT = action.payload;
    });
    builder.addCase(getInvoiceEveryTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось загрузить данные");
    });
    builder.addCase(getInvoiceEveryTT.pending, (state, action) => {
      state.preloader = true;
    });
    ////// getProductEveryInvoice
    builder.addCase(getProductEveryInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.historyEveryInvoice = {
        status: action.payload?.status,
        list: action.payload?.list,
      };
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
    ////// closeKassa
    builder.addCase(closeKassa.fulfilled, (state, action) => {
      state.preloader = false;
      Alert.alert("Касса закрыта");
    });
    builder.addCase(closeKassa.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      Alert.alert("Упс, что-то пошло не так! Не удалось закрыть кассу");
    });
    builder.addCase(closeKassa.pending, (state, action) => {
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
  changeLeftovers,
  changeListSellersPoints,
} = requestSlice.actions;

export default requestSlice.reducer;
