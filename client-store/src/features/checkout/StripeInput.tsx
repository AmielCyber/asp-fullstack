import { Ref, forwardRef, useImperativeHandle, useRef } from "react";
import { InputBaseComponentProps } from "@mui/material";

function StripeInputComponent(
  { component: Component, ...props }: InputBaseComponentProps,
  ref: Ref<unknown>
) {
  const elementRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    focus: () => elementRef.current.focus,
  }));

  return (
    <Component
      onReady={(element: any) => (elementRef.current = element)}
      {...props}
    />
  );
}
const StripeInput = forwardRef(StripeInputComponent);
export default StripeInput;
