////hooks
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

//// tags
import { Image, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native";

///// components
import { clearListProdSearch } from "../../../store/reducers/requestSlice";
import { searchProdSale } from "../../../store/reducers/requestSlice";

/////helpers
import { debounce } from "lodash";

/////fns
import { changeSearchProd } from "../../../store/reducers/stateSlice";

////imgs
import searchIcon from "../../../assets/icons/searchIcon.png";

////style
import styles from "./style";

export const SearchProdsSale = ({}) => {
  const refInput = useRef();

  const dispatch = useDispatch();

  const { searchProd } = useSelector((state) => state.stateSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const searchData = useCallback(
    debounce((text) => {
      if (text?.length > 1) {
        const sendData = { text, seller_guid: data?.seller_guid };
        // Подготовка данных для поиска
        dispatch(searchProdSale({ ...sendData }));
        // Выполнение поиска с заданными параметрами
      }
    }, 500),
    []
  );

  const focus = () => refInput?.current?.focus();

  useEffect(() => {
    setTimeout(() => {
      focus();
    }, 500);
  }, []);

  const onChange = (text) => {
    dispatch(changeSearchProd(text));
    searchData(text);
    text?.length === 0 ? dispatch(clearListProdSearch()) : searchData(text);
  };

  return (
    <View style={styles.blockSearch}>
      <TextInput
        ref={refInput}
        style={styles.inputSearch}
        placeholderTextColor={"#222"}
        placeholder="Поиск товаров ..."
        onChangeText={onChange}
        value={searchProd}
      />
      <TouchableOpacity onPress={focus}>
        <Image style={styles.iconSearch} source={searchIcon} />
      </TouchableOpacity>
    </View>
  );
};
