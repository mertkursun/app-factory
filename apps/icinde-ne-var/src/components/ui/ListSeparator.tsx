import { View, StyleSheet } from "react-native";

const DEFAULT_HEIGHT = 10;

interface ListSeparatorProps {
  height?: number;
}

/** Reusable FlatList item separator to avoid inline arrow functions */
export function ListSeparator({ height = DEFAULT_HEIGHT }: ListSeparatorProps) {
  if (height === DEFAULT_HEIGHT) {
    return <View style={styles.separator} />;
  }
  return <View style={{ height }} />;
}

const styles = StyleSheet.create({
  separator: {
    height: DEFAULT_HEIGHT,
  },
});
