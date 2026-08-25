import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AIPage from './pages/AIPage';
import ProductPage from './pages/ProductPage';
import SpacePage from './pages/SpacePage';
import ModelsPage from './pages/ModelsPage';
import BlogPage from './pages/BlogPage';
import BlogDetails from './pages/BlogDetails';
import NewBlogPage from './pages/NewBlogPage';
import ScrollToTopButton from './components/ScrollToTopButton';

import TokenizerPrototype from './pages/TokenizerPrototype';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/try" element={<SpacePage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/blog-new" element={<NewBlogPage />} />
        <Route path="/new-blog" element={<NewBlogPage />} />
        <Route path="/tokenizer-prototype" element={<TokenizerPrototype />} />
      </Routes>
      <ScrollToTopButton />
    </>
  );
};

export default App;
