import { MainPage } from "./pages/MainPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShoppingCartPage } from "./pages/ShoppingCartPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <MainPage/> }/>
                <Route path="/shopping-cart" element={ <ShoppingCartPage/> }/>
                <Route path="/signup" element={ <SignupPage/> }/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
