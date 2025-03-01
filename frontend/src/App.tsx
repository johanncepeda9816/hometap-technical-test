import React from "react";
import { SearchPropertiesScreen } from "./modules/properties/search";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <SearchPropertiesScreen />
    </>
  );
};

export default App;
