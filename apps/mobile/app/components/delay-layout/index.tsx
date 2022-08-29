import React from "react";
import { ViewProps } from "react-native";
import Animated, { FadeOutUp } from "react-native-reanimated";
import { useDelayLayout } from "../../hooks/use-delay-layout";
import { useThemeStore } from "../../stores/use-theme-store";
import { DefaultPlaceholder } from "./default-placeholder";
import { SettingsPlaceholder } from "./settings-placeholder";

interface IDelayLayoutProps extends ViewProps {
  delay?: number;
  wait?: boolean;
  type?: "default" | "settings";
  color?: string;
  animated?: boolean;
}

const placeholder = {
  default: DefaultPlaceholder,
  settings: SettingsPlaceholder
};

export default function DelayLayout({
  animated = true,
  ...props
}: IDelayLayoutProps) {
  const colors = useThemeStore((state) => state.colors);
  const loading = useDelayLayout(
    !props.delay || props.delay < 300 ? 300 : props.delay
  );
  const Placeholder = placeholder[props.type || "default"];

  return loading || props.wait ? (
    <Animated.View
      exiting={animated ? FadeOutUp : undefined}
      style={{
        backgroundColor: colors.bg,
        flex: 1,
        paddingTop: 20
      }}
    >
      <Placeholder color={props.color || colors.accent} />
    </Animated.View>
  ) : (
    <>{props.children}</>
  );
}
