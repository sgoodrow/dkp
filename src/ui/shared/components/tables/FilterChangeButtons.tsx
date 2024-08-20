"use client";

import { FC } from "react";

export const FilterChangeButtons: FC<{
  onClear: () => void;
  onCancel: () => void;
}> = ({ onClear, onCancel }) => {
  return (
    <>
      <div className="ag-filter-apply-panel">
        <button type="button" className="ag-standard-button" onClick={onClear}>
          Clear
        </button>
        <button type="button" className="ag-standard-button" onClick={onCancel}>
          Close
        </button>
      </div>
    </>
  );
};
