import { Text, View } from "react-native";

const TableSection = ({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) => (
  <View className="mb-6">
    <View className="bg-gray-200 border border-gray-300 rounded-t-md">
      <Text className="font-artegra-bold text-base mb-2 text-center">
        {title}
      </Text>
    </View>
    <View className="border-b border-x border-gray-300 rounded-b-md overflow-hidden">
      <View className="flex-row bg-gray-200 py-2 px-4">
        {headers.map((header, idx) => (
          <Text
            key={idx}
            className="flex-1 font-artegra-bold text-xs text-center"
          >
            {header}
          </Text>
        ))}
      </View>
      {rows.map((row, idx) => (
        <View key={idx} className="flex-row p-2 border-t border-gray-100">
          {row.map((cell, cid) => (
            <Text key={cid} className="flex-1 text-xs text-center">
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  </View>
);

export default TableSection;
