import React, { useRef, useState, useEffect } from "react";
import { View, Text, Alert, Pressable, ToastAndroid } from "react-native";
import MapView, { Marker, Polyline, Callout, LatLng } from "react-native-maps";
import * as Location from "expo-location";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import {
  Angle,
  ArrowsClockwise,
  Image,
  MapPinPlus,
} from "phosphor-react-native";

type Coordinate = {
  latitude: number;
  longitude: number;
};
const getAngleBetweenPoints = (
  main: Coordinate,
  A: Coordinate,
  B: Coordinate
) => {
  const vectorA = {
    x: A.latitude - main.latitude,
    y: A.longitude - main.longitude,
  };
  const vectorB = {
    x: B.latitude - main.latitude,
    y: B.longitude - main.longitude,
  };

  const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  const magnitudeA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2);
  const magnitudeB = Math.sqrt(vectorB.x ** 2 + vectorB.y ** 2);

  const cosTheta = dotProduct / (magnitudeA * magnitudeB);
  const angleRadians = Math.acos(cosTheta);
  const angleDegrees = (angleRadians * 180) / Math.PI;

  return angleDegrees.toFixed(2);
};

export default function AngleMapScreen() {
  const [main, setMain] = useState(null);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [angle, setAngle] = useState<String | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );

  const mapRef = useRef<MapView>(null) as React.MutableRefObject<MapView>;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Izin lokasi ditolak", ToastAndroid.SHORT);
        return;
      }

      let firstUpdate = true;

      const langganan = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (location) => {
          const position = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCurrentLocation(position);

          if (firstUpdate) {
            mapRef.current?.animateToRegion({
              ...position,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            });
            firstUpdate = false;
          }
        }
      );

      return () => langganan.remove();
    })();
  }, []);

  const takePoint = async (setter: any) => {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setter({ latitude, longitude });
  };

  const calculateAngle = () => {
    if (main && pointA && pointB) {
      const result = getAngleBetweenPoints(main, pointA, pointB);
      setAngle(result as String);
    } else {
      ToastAndroid.show("Tentukan 3 titik", ToastAndroid.SHORT);
    }
  };

  const resetPoint = () => {
    setMain(null);
    setPointA(null);
    setPointB(null);
    setAngle(null);
  };

  const ambilScreenshot = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      ToastAndroid.show("Izin media tidak diberikan", ToastAndroid.SHORT);
      return;
    }

    const uri = await captureRef(mapRef, {
      format: "png",
      quality: 1,
    });

    await MediaLibrary.saveToLibraryAsync(uri);
    ToastAndroid.show("Screenshot Disimpan", ToastAndroid.SHORT);
  };

  const allPoint = [main, pointA, pointB].filter(Boolean);

  const coordinates: LatLng[] = [];
  if (main) coordinates.push(main);
  if (pointA) coordinates.push(pointA);
  if (pointB) coordinates.push(pointB);

  return (
    <View style={{ flex: 1 }}>
      <View className="absolute top-14 right-2 left-2 z-50">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">Peta Iteraktif</Text>
          <View className="opacity-0" />
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -6.2,
          longitude: 106.8,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation={true}
        followsUserLocation={false}
      >
        {main && (
          <Marker coordinate={main} pinColor="red">
            <Callout>
              <Text>Point Utama</Text>
            </Callout>
          </Marker>
        )}
        {pointA && (
          <Marker coordinate={pointA} pinColor="green">
            <Callout>
              <Text>Point A</Text>
            </Callout>
          </Marker>
        )}
        {pointB && (
          <Marker coordinate={pointB} pinColor="blue">
            <Callout>
              <Text>Point B</Text>
            </Callout>
          </Marker>
        )}

        {allPoint.length >= 2 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="red"
            strokeWidth={3}
          />
        )}

        {angle && main && (
          <Marker coordinate={main}>
            <Text className="text-red-500 font-josefin-bold text-base">
              {angle}°
            </Text>
          </Marker>
        )}
      </MapView>

      <View className="absolute bottom-5 left-3 right-3 gap-2">
        <Pressable
          onPress={() => takePoint(setMain)}
          className="bg-gray-50 self-end p-1 rounded-full border border-gray-200"
        >
          <MapPinPlus size={30} color="red" />
        </Pressable>
        <Pressable
          onPress={() => takePoint(setPointA)}
          className="bg-gray-50 self-end p-1 rounded-full border border-gray-200"
        >
          <MapPinPlus size={30} color="green" />
        </Pressable>
        <Pressable
          onPress={() => takePoint(setPointB)}
          className="bg-gray-50 self-end p-1 rounded-full border border-gray-200"
        >
          <MapPinPlus size={30} color="blue" />
        </Pressable>
        <Pressable
          onPress={calculateAngle}
          className="bg-gray-50 self-end p-1 rounded-full border border-gray-200"
        >
          <Angle size={30} color="black" />
        </Pressable>
        <Pressable
          onPress={resetPoint}
          className="bg-gray-50 self-end p-1 rounded-full border border-gray-200"
        >
          <ArrowsClockwise size={30} color="black" />
        </Pressable>
        <Pressable
          onPress={ambilScreenshot}
          className="bg-gray-50 self-end p-1 rounded-full border border-gray-200"
        >
          <Image size={30} color="black" />
        </Pressable>
        {/* <Button
          title="Tentukan Titik Utama"
          onPress={() => takePoint(setMain)}
          />
          <Button title="Tentukan Titik A" onPress={() => takePoint(setPointA)} />
          <Button title="Tentukan Titik B" onPress={() => takePoint(setPointB)} />
          <Button title="Hitung Sudut" onPress={calculateAngle} />
          <Button title="Reset Semua Titik" onPress={resetPoint} />
          <Button title="Simpan Screenshot Map" onPress={ambilScreenshot} /> */}
        <View>
          <Text className="font-josefin-bold text-2xl">Sudut: {angle}°</Text>
        </View>
      </View>
    </View>
  );
}
