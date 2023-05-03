import { Box, Pagination, Typography } from "@mui/material";
import { useState } from "react";
// My import.
import type { MetaData } from "../models/pagination";

type Props = {
  metaData: MetaData;
  onPageChange: (page: number) => void;
};

export default function AppPagination(props: Props) {
  const { currentPage, totalCount, totalPages, pageSize } = props.metaData;
  const [pageNumber, setPageNumber] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    props.onPageChange(page);
  };

  const begItemNum = (currentPage - 1) * pageSize + 1;
  let endItemNum = currentPage * pageSize;

  if (endItemNum > totalCount) {
    endItemNum = totalCount;
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography>
        Displaying {begItemNum}-{endItemNum} of {totalCount} items.
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        page={pageNumber}
        count={totalPages}
        onChange={(_, page) => handlePageChange(page)}
      />
    </Box>
  );
}
