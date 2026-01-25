import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { BrowseRecipes, AddRecipe, WeeklyPlan, ShoppingListPage } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BrowseRecipes />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/plan" element={<WeeklyPlan />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
