import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

type Props = {
  options: any[];
  onChange: (event: any) => void;
  selectedValue: string;
};
export default function RadioButtonGroup(props: Props) {
  return (
    <FormControl>
      <RadioGroup onChange={props.onChange} value={props.selectedValue}>
        {props.options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
