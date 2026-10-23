import { Redirect } from "expo-router"

import { DesignSystemScreen } from "@/screens/design-system"

// Dev-only route: production builds send it home.
const DesignSystemRoute = () => (__DEV__ ? <DesignSystemScreen /> : <Redirect href="/" />)

export default DesignSystemRoute
