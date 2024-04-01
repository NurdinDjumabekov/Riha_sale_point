import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataLogin: {
    login: "",
    password: "",
  },
  acceptConfirmInvoice: {
    invoice_guid: "",
    products: [],
  }, // для подтверждения и принятия товаров ТА

  createEveryInvoiceTA: {
    seller_guid: "e7458a29-6f7f-4364-a96d-ed878812f0cf",
    comment: "",
  }, // для создания каждой накладной ТА

  temporaryData: {}, ///// временные данные(после добавления сюда, они добавляются в список(listProductForTT))
  dataInputsInv: { price: "", ves: "" },
  listProductForTT: [],
  stateForCategory: {}, // состояние для хранения временной категории(подсветка категории)
};

const stateSlice = createSlice({
  name: "stateSlice",
  initialState,
  reducers: {
    changeDataLogin: (state, action) => {
      state.dataLogin = action.payload;
    },
    clearLogin: (state) => {
      state.dataLogin = {
        login: "",
        password: "",
      };
    },
    changeAcceptInvoiceTA: (state, action) => {
      state.acceptConfirmInvoice = action.payload;
    },
    clearAcceptInvoiceTA: (state) => {
      state.acceptConfirmInvoice = { invoice_guid: "", products: [] };
    },
    changeEveryInvoiceTA: (state, action) => {
      state.createEveryInvoiceTA = action.payload;
    },
    clearEveryInvoiceTA: (state, action) => {
      state.createEveryInvoiceTA = {
        seller_guid: "e7458a29-6f7f-4364-a96d-ed878812f0cf",
        comment: "",
      };
    },
    changeTemporaryData: (state, action) => {
      state.temporaryData = action.payload;
    },
    changeListProductForTT: (state, action) => {
      state.listProductForTT = action.payload;
    },
    addListProductForTT: (state, action) => {
      state.listProductForTT = [...state.listProductForTT, action.payload];
    },
    removeListProductForTT: (state, action) => {
      const indexToRemove = state.listProductForTT.findIndex(
        (item) => item.guid === action.payload?.guid
      );

      if (indexToRemove !== -1) {
        state.listProductForTT.splice(indexToRemove, 1);
      }
    },
    changeDataInputsInv: (state, action) => {
      state.dataInputsInv = action.payload;
    },
    clearDataInputsInv: (state, action) => {
      state.dataInputsInv = { price: "", ves: "" };
    },
    changeStateForCategory: (state, action) => {
      state.stateForCategory = action.payload;
    },
  },
});
export const {
  changeDataLogin,
  clearLogin,
  changeAcceptInvoiceTA,
  clearAcceptInvoiceTA,
  changeEveryInvoiceTA,
  clearEveryInvoiceTA,
  changeTemporaryData,
  changeListProductForTT,
  addListProductForTT,
  removeListProductForTT,
  changeDataInputsInv,
  clearDataInputsInv,
  changeStateForCategory,
} = stateSlice.actions;

export default stateSlice.reducer;
