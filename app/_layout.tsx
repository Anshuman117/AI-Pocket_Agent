import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey="pk_test_aW1tZW5zZS1jYXJkaW5hbC00My5jbGVyay5hY2NvdW50cy5kZXYk
"
      tokenCache={tokenCache}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </ClerkProvider>
  );
}
