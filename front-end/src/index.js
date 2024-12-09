import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "./components/Theme/Theme";



// CHỈ DÙNG CHAKRA UI VERSION 2 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={Theme}>
        <App />
    </ChakraProvider>
  </React.StrictMode>
);
