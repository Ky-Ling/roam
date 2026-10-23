import { Children, Fragment, type ReactNode } from "react"
import { View } from "react-native"

import { cx } from "@/lib/utils"

/** Grouped list: one white surface with hairlines between rows. */
export const ListGroup = ({ children, className }: { children: ReactNode, className?: string }) => {
  const rows = Children.toArray(children)

  return (
    <View className={cx("overflow-hidden rounded-lg border border-border bg-surface corner-squircle", className)}>
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && <View className="h-px bg-border" />}
          {row}
        </Fragment>
      ))}
    </View>
  )
}
