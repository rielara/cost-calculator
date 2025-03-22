import './App.css';
import CostCalculator from './Calculator/Calculator';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Red Hat Text", sans-serif',
  },
});

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
    <CostCalculator />
    </ThemeProvider>
    </>
  );
}

export default App;
