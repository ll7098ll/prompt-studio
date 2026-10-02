import { FONT_STACKS, type Colors, type Theme } from "./theme";

// Export uses the published DTCG 2025.10 format and color modules.
// https://www.designtokens.org/tr/2025.10/format/
// https://www.designtokens.org/tr/2025.10/color/
const dimension = (value: number) => ({
  $type: "dimension",
  $value: { value, unit: "px" },
});
const alias = ($type: string, path: string) => ({ $type, $value: `{${path}}` });
const colorId = (hex: string) => `c_${hex.slice(1).toLowerCase()}`;

export function themeTokens(theme: Theme) {
  const allColors = [
    ...new Set(
      [...Object.values(theme.light), ...Object.values(theme.dark)].map((c) =>
        c.toLowerCase(),
      ),
    ),
  ];
  const roles = Object.keys(theme.light) as (keyof Colors)[];
  const modeColors = (mode: "light" | "dark") =>
    Object.fromEntries(
      roles.map((role) => [
        role,
        alias("color", `primitive.color.${colorId(theme[mode][role])}`),
      ]),
    );
  return {
    $description:
      "Prompt Studio theme. Light/dark are named groups; semantic aliases select the current mode. Change those aliases to switch mode in a token tool.",
    $extensions: {
      "studio.prompt": {
        formatVersion: "2025.10",
        currentMode: theme.mode,
        themeName: theme.name,
        density: theme.density,
      },
    },
    primitive: {
      color: Object.fromEntries(
        allColors.map((hex) => [
          colorId(hex),
          {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: [1, 3, 5].map(
                (index) => parseInt(hex.slice(index, index + 2), 16) / 255,
              ),
              alpha: 1,
              hex,
            },
          },
        ]),
      ),
      radius: dimension(theme.radius),
      spacing: dimension(24 * theme.density),
      bodyFont: {
        $type: "fontFamily",
        $value: FONT_STACKS[theme.font]
          .split(",")
          .map((font) => font.trim().replaceAll('"', "")),
      },
      bodySize: dimension(14),
      bodyLineHeight: { $type: "number", $value: 1.65 },
    },
    modes: {
      light: { color: modeColors("light") },
      dark: { color: modeColors("dark") },
    },
    semantic: {
      color: Object.fromEntries(
        roles.map((role) => [
          role,
          alias("color", `modes.${theme.mode}.color.${role}`),
        ]),
      ),
      radius: alias("dimension", "primitive.radius"),
      spacing: alias("dimension", "primitive.spacing"),
      bodyFont: alias("fontFamily", "primitive.bodyFont"),
      bodySize: alias("dimension", "primitive.bodySize"),
      bodyLineHeight: alias("number", "primitive.bodyLineHeight"),
    },
    component: {
      button: {
        background: alias("color", "semantic.color.primary"),
        text: alias("color", "semantic.color.onPrimary"),
        radius: dimension(theme.radius * 0.55),
        fontSize: dimension(13),
      },
      card: {
        background: alias("color", "semantic.color.surface"),
        border: alias("color", "semantic.color.border"),
        radius: alias("dimension", "semantic.radius"),
      },
      field: {
        background: alias("color", "semantic.color.surface"),
        text: alias("color", "semantic.color.foreground"),
        radius: dimension(theme.radius * 0.5),
      },
    },
  };
}
