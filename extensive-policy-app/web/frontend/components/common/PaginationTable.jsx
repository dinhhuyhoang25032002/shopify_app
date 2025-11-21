import { Pagination } from "@shopify/polaris";
import React from "react";

export default function PaginationTable({
  onPrevious,
  onNext,
  index = 0,
  type,
  total,
  disableNext,
  disablePrev,
  pageSize,
}) {
  // Nếu disableNext/disablePrev không truyền, fallback tính toán tự động
  const hasNext =
    disableNext !== undefined ? !disableNext : (index + 1) * pageSize < total;
  const hasPrevious = disablePrev !== undefined ? !disablePrev : index > 0;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
      <Pagination
        onPrevious={onPrevious}
        onNext={onNext}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        label={`${index * pageSize + 1}-${
          Math.min((index + 1) * pageSize, total) || 0
        } of ${total ?? 0} ${type}`}
      />
    </div>
  );
}
