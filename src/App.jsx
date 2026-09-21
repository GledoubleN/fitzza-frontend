import { MainPage } from "./pages/MainPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShoppingCartPage } from "./pages/ShoppingCartPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { TryOnPage } from './pages/TryOnPage.jsx'
import { SearchResultPage } from './pages/SearchResultPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import {CommunityMainPage} from "./pages/community/CommunityMainPage.jsx";
import {CommunityWritePage} from "./pages/community/CommunityWritePage.jsx";
import {CommunityArticlePage} from "./pages/community/CommunityArticlePage.jsx";
import { PromptPage } from './pages/PromptPage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import MyPage from './pages/MyPage.jsx'
import WorldCupPage from './pages/WorldCupPage.jsx'
import { DevNavi } from './pages/ForDev/DevNavi.jsx'
import { LikesPage } from './pages/LikesPage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage/> }/>
        <Route path="/shopping-cart" element={ <ShoppingCartPage/> }/>
        <Route path="/signin" element={ <SignInPage/> }/>
        <Route path="/signup" element={ <SignupPage/> }/>
        <Route path="/try-on" element={ <TryOnPage/> }/>
        <Route path="/search" element={ <SearchResultPage/> }/>
        <Route path="/products/:id" element={ <ProductPage/> }/>
        <Route path="/checkout" element={ <CheckoutPage/> }/>
        <Route path="/communitymain" element={ <CommunityMainPage/> }/>
        <Route path="/communityarticle/:id" element={ <CommunityArticlePage/> }/>
        <Route path="/communitywrite" element={ <CommunityWritePage/> }/>
        <Route path="/prompt" element={ <PromptPage/> }/>
        <Route path="/mypage" element={ <MyPage/> }/>
        <Route path="/worldcup" element={ <WorldCupPage/> }/>
        <Route path="/dev" element={ <DevNavi/> }/>
        <Route path="/likes" element={ <LikesPage/> }/>
        <Route path="/category" element={ <CategoryPage/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;