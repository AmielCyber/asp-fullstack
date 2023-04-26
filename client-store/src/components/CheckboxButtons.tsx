import { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

type Props = {
  items: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
};

export default function CheckboxButtons(props: Props) {
  const [checkedItems, setCheckedItems] = useState(props.checked || []);

  const handleChecked = (value: string) => {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newChecked: string[] = [];
    if (currentIndex === -1) {
      newChecked = [...checkedItems, value];
    } else {
      newChecked = checkedItems.filter((item) => item !== value);
    }
    setCheckedItems(newChecked);
    props.onChange(newChecked);
  };

  return (
    <FormGroup>
      {props.items.map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.indexOf(item) !== -1}
              onClick={() => handleChecked(item)}
            />
          }
          label={item}
          key={item}
        />
      ))}
    </FormGroup>
  );
}
