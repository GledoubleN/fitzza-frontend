import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { MainPage } from "./pages/MainPage.jsx";
import { Route, Routes } from "react-router-dom";
import { ShoppingCartPage } from "./pages/ShoppingCartPage.jsx";

function App() {
  return (
    <Browser>
     <Routes>
       <Route path="/" component={MainPage} />
       <Route path="/shopping-cart" component={ShoppingCartPage} />
     </Routes>
    </Browser>
  )
}

export default App
