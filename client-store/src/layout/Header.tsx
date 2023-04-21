import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

type Props = {
  darkMode: boolean;
  onThemeChange: () => void;
};

export default function Header(props: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6">RE-STORE</Typography>
        <Switch checked={props.darkMode} onChange={props.onThemeChange} />
      </Toolbar>
    </AppBar>
  );
}
