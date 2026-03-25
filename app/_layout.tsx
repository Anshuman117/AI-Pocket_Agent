import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey="pk_test_aW1tZW5zZS1jYXJkaW5hbC00My5jbGVyay5hY2NvdW50cy5kZXYk
"
      tokenCache={tokenCache}
    >
      <StatusBar
        style="dark"
        hidden={false}
        translucent={false}
        backgroundColor="#ffffff"
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </ClerkProvider>
  );
}
