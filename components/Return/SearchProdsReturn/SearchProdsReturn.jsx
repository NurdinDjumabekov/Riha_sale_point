////// tags
import { Image, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native";
import { debounce } from "lodash";

///// hooks
import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

////// imgs
import searchIcon from "../../../assets/icons/searchIcon.png";

////// helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

////// fns
import { changeSearchProd } from "../../../store/reducers/stateSlice";
import { changeLocalData } from "../../../store/reducers/saveDataSlice";
import { searchProdTT } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

export const SearchProdsReturn = ({ getData, location }) => {
  const refInput = useRef();

  const dispatch = useDispatch();

  const { searchProd } = useSelector((state) => state.stateSlice);

  const { data } = useSelector((state) => state.saveDataSlice);

  const searchData = useCallback(
    debounce((text) => {
      if (text?.length > 1) {
        getLocalDataUser({ changeLocalData, dispatch });
        const sendData = { searchProd: text, seller_guid: data?.seller_guid };
        dispatch(searchProdTT({ ...sendData, location }));
        // Выполнение поиска с заданными параметрами
      }
    }, 800),
    [data]
  );

  const onChange = (text) => {
    dispatch(changeSearchProd(text));
    text?.length === 0 ? getData() : searchData(text);
  };

  return (
    <View style={styles.blockSearch}>
      <TextInput
        style={styles.inputSearch}
        placeholderTextColor={"#222"}
        placeholder="Поиск товаров ..."
        onChangeText={onChange}
        value={searchProd}
        ref={refInput}
      />
      <TouchableOpacity onPress={() => refInput?.current?.focus()}>
        <Image style={styles.iconSearch} source={searchIcon} />
      </TouchableOpacity>
    </View>
  );
};
