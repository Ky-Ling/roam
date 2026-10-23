import Svg, { Path } from "react-native-svg"

import { colors } from "@/theme"

// Traced from the design at 390 wide: the sheet peaks around x=95, slopes ~28 lower by x=340,
// then rounds into the right edge. Stretched horizontally on other widths.
const PATH = "M0 56 L0 26 Q0 3 24 2 C52 1 76 0 95 0 C165 0 262 10 340 28 Q386 39 390 56 Z"

/** The sheet's curved top edge, drawn over the photo. 56 tall; the page fills white below it. */
export const SheetCurve = () => (
  <Svg width="100%" height={56} viewBox="0 0 390 56" preserveAspectRatio="none" className="absolute inset-x-0 top-0">
    <Path d={PATH} fill={colors.surface} />
  </Svg>
)
