//////// tags
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Vibration, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import BarcodeMask from "react-native-barcode-mask";

//////// hooks
import { useDispatch, useSelector } from "react-redux";

//////// fns
import { getEveryProd } from "../../../store/reducers/requestSlice";

////// styles
import styles from "./style";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Рамка для проверки, находится ли QR-код в центре экрана
const FRAME_X = (SCREEN_WIDTH - 280) / 2;
const FRAME_Y = (SCREEN_HEIGHT - 280) / 2;
const FRAME_WIDTH = 280;
const FRAME_HEIGHT = 280;

const isCodeInCenter = (boundingBox) => {
  const { origin, size } = boundingBox;

  // Масштабирование координат bounding box
  const previewWidth = SCREEN_WIDTH; // ширина предварительного просмотра камеры
  const previewHeight = SCREEN_HEIGHT; // высота предварительного просмотра камеры

  const scaleX = SCREEN_WIDTH / previewWidth;
  const scaleY = SCREEN_HEIGHT / previewHeight;

  const codeLeft = origin.x * scaleX - 240;
  const codeRight = (origin.x + size.width) * scaleX - 300;
  const codeTop = origin.y * scaleY + 200;
  const codeBottom = (origin.y + size.height) * scaleY + 240;

  const frameLeft = FRAME_X;
  const frameRight = FRAME_X + FRAME_WIDTH;
  const frameTop = FRAME_Y;
  const frameBottom = FRAME_Y + FRAME_HEIGHT;

  // console.log(
  //   `Координаты кода - Лево: ${codeLeft}, Право: ${codeRight}, Верх: ${codeTop}, Низ: ${codeBottom}`
  // );
  // console.log(
  //   `Координаты рамки - Лево: ${frameLeft}, Право: ${frameRight}, Верх: ${frameTop}, Низ: ${frameBottom}`
  // );

  // console.log(size.width, "size.width");
  // console.log(size.height, "size.height");

  const check1 = codeLeft >= frameLeft;
  // console.log(check1, "check1");
  const check2 = codeRight <= frameRight;
  // console.log(check2, "check2");
  const check3 = codeTop >= frameTop;
  // console.log(check3, "check3");
  const check4 = codeBottom <= frameBottom;
  // console.log(check4, "check4");

  const allCheck = check1 && check2 && check3 && check4;

  return allCheck;
};

export const ScannerSaleScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const { data } = useSelector((state) => state.saveDataSlice);

  const seller_guid = data?.seller_guid;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const showResultModal = async ({ data, boundingBox }) => {
    // console.log(`Сканированные данные: ${data}`, boundingBox);

    if (data && !scanned && isCodeInCenter(boundingBox)) {
      setScanned(true);
      const obj = { qrcode: data, seller_guid, navigation };
      dispatch(getEveryProd(obj));
      Vibration.vibrate();
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted || hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Разрешите доступ к камере в настройках вашего устройства!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : showResultModal}
        style={StyleSheet.absoluteFillObject}
      >
        <BarcodeMask
          edgeColor={"rgba(12, 169, 70, 0.9)"}
          edgeRadius={10}
          width={280}
          height={280}
          animatedLineColor={"#f32a2a"}
          animatedLineHeight={2}
          animatedLineWidth={"97%"}
          showAnimatedLine={true}
          outerMaskOpacity={0.7}
          useNativeDriver={false}
          edgeBorderWidth={5}
        />
        {/* Визуализация рамки */}
        {/* <View
          style={{
            position: "absolute",
            left: FRAME_X,
            top: FRAME_Y,
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            borderWidth: 2,
            borderColor: "red",
          }}
        /> */}
      </Camera>
    </View>
  );
};

export default ScannerSaleScreen;
