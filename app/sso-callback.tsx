import Color from "@/share/Color";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useEffect } from "react";

export default function SsoCallbackScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isSignedIn) {
      router.replace("/(tabs)/Home");
      return;
    }

    router.replace("/");
  }, [isLoaded, isSignedIn, router]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: Color.WHITE,
      }}
    >
      <ActivityIndicator size="large" color={Color.PRIMARY} />
      <Text style={{ marginTop: 16, fontSize: 16, color: Color.GRAY }}>
        Completing sign in...
      </Text>
    </View>
  );
}
