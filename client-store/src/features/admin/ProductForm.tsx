import { FieldValues, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
// My imports
import type Product from "../../models/product";
import useProducts from "../../hooks/useProducts";
import { useAppDispatch } from "../../store/configureStore";
import agent from "../../api/agent";
import { setProduct } from "../catalog/catalogSlice";
import { validationSchema } from "./productValidation";
import AppTextInput from "../../components/AppTextInput";
import AppSelectList from "../../components/AppSelectList";
import AppDropzone from "../../components/AppDropzone";

type Props = {
  product?: Product;
  cancelEdit: () => void;
};

export default function ProductForm(props: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { brands, types } = useProducts();
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (props.product && !watchFile && !isDirty) {
      reset(props.product);
    }
    return () => {
      if (watchFile) {
        URL.revokeObjectURL(watchFile.preview);
      }
    };
  }, [props.product, reset, watchFile, isDirty]);

  const handleSubmitData = async (data: FieldValues) => {
    try {
      let response: Product;
      if (props.product) {
        response = await agent.Admin.updateProduct(data);
      } else {
        response = await agent.Admin.createProduct(data);
      }
      dispatch(setProduct(response));
      props.cancelEdit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Product Details
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="name" label="Product name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList
              control={control}
              items={brands}
              name="brand"
              label="Brand"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList
              control={control}
              items={types}
              name="type"
              label="Type"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              type="number"
              control={control}
              name="price"
              label="Price"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              type="number"
              control={control}
              name="quantityInStock"
              label="Quantity in Stock"
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              control={control}
              multiline={true}
              rows={4}
              name="description"
              label="Description"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <AppDropzone control={control} name="file" />
              {watchFile ? (
                <img
                  src={watchFile.preview}
                  alt="preview"
                  style={{ maxHeight: 200 }}
                />
              ) : (
                <img
                  src={props.product?.pictureUrl}
                  alt={props.product?.name}
                  style={{ maxHeight: 200 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button
            onClick={props.cancelEdit}
            variant="contained"
            color="inherit"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
            color="success"
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}
