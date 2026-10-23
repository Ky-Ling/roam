import { Pressable } from "react-native"

import { Text } from "@/components/ui/text"

type AuthSwitchLinkProps = {
  prompt: string
  action: string
  onPress: () => void
  disabled?: boolean
}

/** "Already have an account? Sign in": the footer link between sign-up and sign-in. */
export const AuthSwitchLink = ({ prompt, action, onPress, disabled }: AuthSwitchLinkProps) => (
  <Pressable
    accessibilityRole="link"
    accessibilityLabel={`${prompt} ${action}`}
    disabled={disabled}
    hitSlop={8}
    onPress={onPress}
    className="self-center active:opacity-85"
  >
    <Text variant="caption" tone="secondary">
      {prompt}{" "}
      <Text variant="caption" className="font-jakarta-semibold underline">
        {action}
      </Text>
    </Text>
  </Pressable>
)
