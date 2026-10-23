import { Image } from "expo-image"

// Google's official multicolor "G" (sign-in branding asset), drawn at 24 as the guidelines' button size.
export const GoogleLogo = () => (
  <Image
    source={require("@/assets/images/google-g.svg")}
    style={{ width: 24, height: 24 }}
    contentFit="contain"
    accessibilityElementsHidden
  />
)
