import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';


const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: [
      'Sarabun',
      'Roboto',
      'sans-serif',
    ],
  },
  palette: {
    primary: {
      light: '#757ce8',
      main: '#0d47a1',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#ffffff',
      dark: '#ba000d',
      contrastText: '#000',
    },
  }
});


ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
