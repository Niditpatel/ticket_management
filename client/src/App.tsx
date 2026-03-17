import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import TicketListPage from './pages/TicketListPage';
import CreateTicketPage from './pages/CreateTicketPage';
import EditTicketPage from './pages/EditTicketPage';
import UserManagementPage from './pages/UserManagementPage';
import { PlusCircle, Ticket, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif]">
          {/* Compact Header */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/40">
            <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link to="/" className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-primary" />TicketFlow
                </Link>
                <nav className="flex items-center gap-1">
                  <NavLink to="/" className={({ isActive }) => `text-xs px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Tickets</NavLink>
                  <NavLink to="/users" className={({ isActive }) => `text-xs px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Users</NavLink>
                </nav>
              </div>
              <Link to="/create">
                <Button size="sm" className="h-8 text-xs rounded-lg"><PlusCircle className="w-3.5 h-3.5 mr-1.5" />New Ticket</Button>
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className="max-w-6xl mx-auto px-4 py-4">
            <Routes>
              <Route path="/" element={<TicketListPage />} />
              <Route path="/create" element={<CreateTicketPage />} />
              <Route path="/edit/:id" element={<EditTicketPage />} />
              <Route path="/users" element={<UserManagementPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
