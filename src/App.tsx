import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import SubjectsPage from './pages/SubjectsPage';
import GraphPage from './pages/GraphPage';
import LibrarianPage from './pages/LibrarianPage';
import ComparisonPage from './pages/ComparisonPage';
import MyBooksPage from './pages/MyBooksPage';
import AboutPage from './pages/AboutPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LibraryProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/subjects" element={<SubjectsPage />} />
                  <Route path="/graph" element={<GraphPage />} />
                  <Route path="/librarian" element={<LibrarianPage />} />
                  <Route path="/comparison" element={<ComparisonPage />} />
                  <Route path="/my-books" element={<MyBooksPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LibraryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
