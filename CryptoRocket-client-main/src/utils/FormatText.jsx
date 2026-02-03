/* eslint-disable react/prop-types */
import { NumericFormat } from "react-number-format";

export const NumberFormatCommas = ({ value, decimalScale }) => {
  return (
    <NumericFormat
      value={value}
      displayType={"text"}
      thousandSeparator={true}
      thousandsGroupStyle="lakh"
      decimalScale={decimalScale || 2}
      fixedDecimalScale={decimalScale !== 0 && true}
    />
  );
};
