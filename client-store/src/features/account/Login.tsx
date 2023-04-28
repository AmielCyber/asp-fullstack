import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
// My imports.
import { useAppDispatch } from "../../store/configureStore";
import { signInUser } from "./accountSlice";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onTouched",
  });

  const submitForm = async (data: FieldValues) => {
    try {
      await dispatch(signInUser(data));
      navigate(location.state?.from || "/catalog");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          required
          margin="normal"
          fullWidth
          label="Username"
          {...register("username", { required: "Username is required" })}
          autoFocus
          error={!!errors.username}
          helperText={errors.username?.message as string}
        />
        <TextField
          required
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/register">Don't have an account? Sign Up"</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
