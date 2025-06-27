import React from "react";
import * as FlagIcons from "country-flag-icons/react/3x2";
import countryLabelToCodeMap from "../utils/objects/country-label-to-code-map";
import { useSelector } from "react-redux";
import { State } from "../utils/interfaces/state";

/**
 * Props for NationalityWithFlag component.
 * @property nationality The country name to display with flag.
 */
interface NationalityWithFlagProps {
  nationality: string;
}

/**
 * Displays a nationality name with its corresponding country flag.
 * Uses country-flag-icons library and adapts to the current theme.
 *
 * @param props NationalityWithFlagProps
 */
const NationalityWithFlag: React.FC<NationalityWithFlagProps> = ({
  nationality,
}) => {
  const theme = useSelector((state: State) => state.theme);
  const code = countryLabelToCodeMap.get(nationality) || "";
  const FlagComponent = code
    ? (
        FlagIcons as Record<
          string,
          React.ComponentType<React.SVGProps<SVGSVGElement>>
        >
      )[code]
    : null;

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", marginRight: 8 }}
    >
      {nationality}
      {FlagComponent && (
        <FlagComponent
          aria-label={nationality}
          style={{
            marginLeft: 4,
            width: 18,
            height: 12,
            display: "inline-block",
            verticalAlign: "middle",
            border: theme === "dark" ? "1px solid #fff" : "1px solid #000",
          }}
        />
      )}
    </span>
  );
};

export default NationalityWithFlag;
