import { MainPage } from "./pages/MainPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShoppingCartPage } from "./pages/ShoppingCartPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SearchResultPage } from './pages/SearchResultPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { CommunityMainPage } from "./pages/community/CommunityMainPage.jsx";
import { CommunityWritePage } from "./pages/community/CommunityWritePage.jsx";
import { CommunityArticlePage } from "./pages/community/CommunityArticlePage.jsx";
import { ProductPage } from './pages/ProductPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { VtonGalleryPage } from './pages/profile/VtonGalleryPage.jsx'
import WorldCupPage from './pages/WorldCupPage.jsx'
import { ShortcutPage } from './pages/ShortcutPage.jsx'
import { WishlistPage } from './pages/WishlistPage.jsx'
import { SelectPage } from './pages/SelectPage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'
import { OrderDetail } from './pages/OrderDetailPage';
import { OrderListPage } from './pages/OrderListPage.jsx'
import { ThemePreviewPage } from './pages/ThemePreviewPage.jsx'
import { AIStylistPage } from './pages/ai-stylist/AIStylistPage.jsx'
import { AIHistoryPage } from './pages/ai-stylist/AIHistoryPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx';
import { RequireSignIn } from './components/RequireSignIn.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage/> }/>
        <Route path="/shopping-cart" element={ <RequireSignIn><ShoppingCartPage/></RequireSignIn> }/>
        <Route path="/signin" element={ <SignInPage/> }/>
        <Route path="/signup" element={ <SignUpPage/> }/>
        <Route path="/search" element={ <SearchResultPage/> }/>
        <Route path="/products/:id" element={ <ProductPage/> }/>
        <Route path="/checkout" element={ <RequireSignIn><CheckoutPage/></RequireSignIn> }/>
        <Route path="/community/main" element={ <CommunityMainPage/> }/>
        <Route path="/community/articles/:id" element={ <CommunityArticlePage/> }/>
        <Route path="/community/write" element={ <RequireSignIn><CommunityWritePage/></RequireSignIn> }/>
        <Route path="/profile" element={ <RequireSignIn><ProfilePage/></RequireSignIn> }/>
        <Route path="/profile/fittings" element={ <RequireSignIn><VtonGalleryPage/></RequireSignIn> }/>
        <Route path="/worldcup" element={ <RequireSignIn><WorldCupPage/></RequireSignIn> }/>
        <Route path="/shortcuts" element={ <ShortcutPage/> }/>
        <Route path="/wishlist" element={ <RequireSignIn><WishlistPage/></RequireSignIn> }/>
        <Route path="/select" element={ <RequireSignIn><SelectPage/></RequireSignIn> }/>
        <Route path="/categories" element={ <CategoryPage/> }/>
        <Route path="/orders" element={ <RequireSignIn><OrderListPage/></RequireSignIn> }/>
        <Route path="/orders/:orderId" element={ <RequireSignIn><OrderDetail/></RequireSignIn> }/>
        <Route path="/theme-preview" element={<ThemePreviewPage />} />
        <Route path="/ai/history" element={ <RequireSignIn><AIHistoryPage/></RequireSignIn> }/>
        <Route path="/ai/:requestId?" element={ <RequireSignIn><AIStylistPage/></RequireSignIn> }/>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
