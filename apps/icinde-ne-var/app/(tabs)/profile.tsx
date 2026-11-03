import { View, Text } from "react-native";
import { User } from "lucide-react-native";

const PRIMARY_COLOR = "#0F766E";
const ICON_SIZE = 48;

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <User size={ICON_SIZE} color={PRIMARY_COLOR} />
      <Text className="font-title text-2xl text-text">Profil</Text>
      <Text className="font-body text-base text-text-secondary">Profilinizi buradan yönetin</Text>
    </View>
  );
}
