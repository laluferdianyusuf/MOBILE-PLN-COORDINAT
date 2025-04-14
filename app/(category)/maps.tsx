import React, { useRef, useState, useEffect } from "react";
import { View, Text, Alert, Pressable, ToastAndroid } from "react-native";
import MapView, {
  Marker,
  Polyline,
  Callout,
  LatLng,
  Polygon,
} from "react-native-maps";
import * as Location from "expo-location";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";

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

const getAddressFromCoords = async (latitude: number, longitude: number) => {
  const [address] = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  if (address) {
    return [
      address.name,
      address.street,
      address.district,
      address.city || address.subregion,
      address.region,
      address.postalCode,
      address.country,
      address.isoCountryCode,
      address.timezone,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return "Alamat tidak ditemukan";
};

export default function AngleMapScreen() {
  const [main, setMain] = useState(null);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [angle, setAngle] = useState<String | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [addressName, setAddressName] = useState<string>("");

  const mapRef = useRef<MapView>(null) as React.MutableRefObject<MapView>;

  useEffect(() => {
    if (main && pointA && pointB) {
      const result = getAngleBetweenPoints(main, pointA, pointB);
      setAngle(result);
    }
  }, [main, pointA, pointB]);

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

  useEffect(() => {
    if (currentLocation) {
      getAddressFromCoords(currentLocation.latitude, currentLocation.longitude)
        .then(setAddressName)
        .catch(() => setAddressName("Gagal mengambil alamat"));
    }
  }, [currentLocation]);

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
      <View className="absolute top-14 right-2 left-2 z-50 justify-center">
        <View className="flex-row items-center justify-between py-4 px-3 rounded-xl bg-white">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">Peta Sudut</Text>
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
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "red",
              }}
            />
          </Marker>
        )}
        {pointA && (
          <Marker coordinate={pointA} pinColor="green">
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "green",
              }}
            />
          </Marker>
        )}
        {pointB && (
          <Marker coordinate={pointB} pinColor="blue">
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "blue",
              }}
            />
          </Marker>
        )}

        {allPoint.length >= 2 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="yellow"
            strokeWidth={3}
          />
        )}

        {coordinates.length === 3 && (
          <>
            <Polyline
              coordinates={coordinates}
              strokeColor="yellow"
              strokeWidth={3}
            />

            <Polygon
              coordinates={coordinates}
              strokeColor="#00000000"
              fillColor="rgba(30, 144, 255, 0.3)"
            />
          </>
        )}

        {angle && pointA && (
          <Marker coordinate={pointA} anchor={{ x: 0.5, y: 0 }}>
            <Text className="text-red-500 font-josefin-bold text-base">
              {angle}°
            </Text>
          </Marker>
        )}
      </MapView>

      <View className="absolute bottom-5 left-3 right-3 gap-2">
        <View>
          <Text className="font-josefin-bold text-2xl">Sudut: {angle}°</Text>
        </View>
        <Pressable
          onPress={() => takePoint(setMain)}
          className="bg-gray-50 p-1 rounded-xl border border-gray-200 flex flex-row items-center justify-center gap-3"
        >
          <Text className="font-helvetica-regular self-center">
            Tentukan Point 1
          </Text>
        </Pressable>
        <Pressable
          onPress={() => takePoint(setPointA)}
          className="bg-gray-50 p-1 rounded-xl border border-gray-200 flex flex-row items-center justify-center gap-3"
        >
          <Text className="font-helvetica-regular self-center">
            Tentukan Point 2
          </Text>
        </Pressable>
        <Pressable
          onPress={() => takePoint(setPointB)}
          className="bg-gray-50 p-1 rounded-xl border border-gray-200 flex flex-row items-center justify-center gap-3"
        >
          <Text className="font-helvetica-regular self-center">
            Tentukan Point 3
          </Text>
        </Pressable>
        <Pressable
          onPress={resetPoint}
          className="bg-gray-50 p-1 rounded-xl border border-gray-200 "
        >
          <Text className="font-helvetica-regular self-center">
            Reset Titik
          </Text>
        </Pressable>
        <Pressable
          onPress={ambilScreenshot}
          className="bg-gray-50 p-1 rounded-xl border border-gray-200"
        >
          <Text className="font-helvetica-regular self-center">
            Simpan Map Ke Gallery
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
