import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
// My import.
import { useAppSelector } from "../store/configureStore";

type Props = {
  roles?: string[];
};

export default function RequiredAuth(props: Props) {
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  if (props.roles && !props.roles.some((r) => user.roles?.includes(r))) {
    toast.error("Not authorized to access this area");
    return <Navigate to="/catalog" />;
  }
  return <Outlet />;
}
