import { MainPage } from "./pages/MainPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShoppingCartPage } from "./pages/ShoppingCartPage.jsx";
import {SignInPage} from "./pages/SignInPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage/> }/>
        <Route path="/shopping-cart" element={ <ShoppingCartPage/> }/>
        <Route path="/signin" element={ <SignInPage/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
