import React from "react";

function Dropdown({ refProp, availableOptions }) {
  return (
    <select ref={refProp} id="serviceOptions">
      {availableOptions &&
        availableOptions.map((option) => {
          return typeof option === "string" ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : typeof option === "object" ? (
            <option key={option.branchID} value={option.branchName}>
              {option.branchName}
            </option>
          ) : (
            <></>
          );
        })}
    </select>
  );
}

export default Dropdown;
