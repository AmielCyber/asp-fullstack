import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, debounce } from "@mui/material";
// My imports.
import { useAppSelector } from "../../store/configureStore";
import { setProductParams } from "./catalogSlice";

export default function ProductSearch() {
  const { productParams } = useAppSelector((state) => state.catalog);
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm || "");
  const dispatch = useDispatch();

  const debouncedSearch = debounce(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      dispatch(setProductParams({ searchTerm: event.target.value }));
    },
    1000
  );

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(event) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
      }}
    />
  );
}
