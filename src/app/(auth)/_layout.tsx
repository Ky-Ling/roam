import { Stack } from "expo-router"

const AuthLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="sign-up" />
    <Stack.Screen name="verify-email" />
    <Stack.Screen name="sign-in" />
  </Stack>
)

export default AuthLayout
