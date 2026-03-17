import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { fetchTickets, fetchTicketStats, deleteTicket, setFilters, setPage } from '../store/ticketSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Edit, Search, FilterX, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const P: Record<string, string> = { High: 'bg-red-50 text-red-600 border-red-200', Medium: 'bg-amber-50 text-amber-600 border-amber-200', Low: 'bg-slate-50 text-slate-500 border-slate-200' };
const S: Record<string, string> = { Open: 'bg-blue-50 text-blue-600 border-blue-200', 'In Progress': 'bg-violet-50 text-violet-600 border-violet-200', Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200' };

const TicketListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector((s: RootState) => s.tickets.tickets) ?? [];
  const loading = useSelector((s: RootState) => s.tickets.loading) ?? false;
  const filters = useSelector((s: RootState) => s.tickets.filters) ?? { search: '', status: '', priority: '' };
  const pagination = useSelector((s: RootState) => s.tickets.pagination) ?? { page: 1, limit: 10, totalPages: 1, total: 0 };
  const stats = useSelector((s: RootState) => s.tickets.stats) ?? { total: 0, open: 0, inProgress: 0, resolved: 0 };

  const [search, setSearch] = useState(filters.search || '');
  const [delId, setDelId] = useState<string | null>(null);

  useEffect(() => { const t = setTimeout(() => dispatch(setFilters({ search })), 400); return () => clearTimeout(t); }, [search, dispatch]);
  
  // Use primitive deps to avoid double-firing
  const fStatus = filters.status;
  const fPriority = filters.priority;
  const fSearch = filters.search;
  const currentPage = pagination.page;
  const currentLimit = pagination.limit;
  
  useEffect(() => {
    dispatch(fetchTickets({ status: fStatus, priority: fPriority, search: fSearch, page: currentPage, limit: currentLimit }));
  }, [fStatus, fPriority, fSearch, currentPage, currentLimit, dispatch]);
  
  useEffect(() => { dispatch(fetchTicketStats()); }, [dispatch]);

  const handleDel = async (id: string) => {
    if (!confirm('Delete this ticket?')) return;
    setDelId(id);
    await dispatch(deleteTicket(id));
    dispatch(fetchTickets({ ...filters, page: 1, limit: pagination.limit }));
    dispatch(fetchTicketStats());
    setDelId(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { l: 'Total', v: stats.total, c: 'text-slate-700' },
          { l: 'Open', v: stats.open, c: 'text-blue-600' },
          { l: 'Active', v: stats.inProgress, c: 'text-violet-600' },
          { l: 'Done', v: stats.resolved, c: 'text-emerald-600' },
        ].map(s => (
          <div key={s.l} className="bg-white border border-border/60 rounded-xl py-2.5 px-3">
            <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters row — very compact */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input placeholder="Search..." className="h-8 text-xs pl-8 rounded-lg border-border/60" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select onValueChange={v => dispatch(setFilters({ status: v === 'all' ? '' : v }))} value={filters.status || 'all'}>
          <SelectTrigger className="h-8 text-xs w-[120px] rounded-lg border-border/60"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Open">Open</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Resolved">Resolved</SelectItem></SelectContent>
        </Select>
        <Select onValueChange={v => dispatch(setFilters({ priority: v === 'all' ? '' : v }))} value={filters.priority || 'all'}>
          <SelectTrigger className="h-8 text-xs w-[120px] rounded-lg border-border/60"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Priority</SelectItem><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={() => { setSearch(''); dispatch(setFilters({ status: '', priority: '', search: '' })); }} className="h-8 text-xs text-slate-400">
          <FilterX className="w-3 h-3 mr-1" />Clear
        </Button>
      </div>

      {/* Dense Table */}
      <div className="border border-border/60 rounded-xl overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-border/40">
              <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500 pl-3">Issue</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Priority</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Assignee</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Time</TableHead>
              <TableHead className="h-8 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-right pr-3">Act</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs text-slate-400"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</TableCell></TableRow>
            ) : tickets.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs text-slate-400">No tickets found.</TableCell></TableRow>
            ) : tickets.map(t => (
              <TableRow key={t._id} className="group border-b border-border/30 hover:bg-slate-50/50">
                <TableCell className="py-2 pl-3 pr-2">
                  <div className="text-sm font-medium text-slate-800 truncate max-w-[240px]">{t.title}</div>
                  <div className="text-[10px] text-slate-400 sm:hidden flex gap-2 mt-0.5">
                    <Badge variant="outline" className={`text-[9px] py-0 h-4 px-1.5 ${P[t.priority] || ''}`}>{t.priority}</Badge>
                    <span>{t.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2 hidden sm:table-cell"><Badge variant="outline" className={`text-[10px] py-0 h-5 ${P[t.priority] || ''}`}>{t.priority}</Badge></TableCell>
                <TableCell className="py-2"><Badge variant="outline" className={`text-[10px] py-0 h-5 ${S[t.status] || ''}`}>{t.status}</Badge></TableCell>
                <TableCell className="py-2 hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">{t.assignedTo?.name?.charAt(0) || '?'}</div>
                    <span className="text-xs text-slate-600 truncate max-w-[100px]">{t.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2 hidden lg:table-cell text-[10px] text-slate-400">{formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="py-2 text-right pr-3">
                  <div className="flex justify-end gap-0.5">
                    <Link to={`/edit/${t._id}`}><Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-100"><Edit className="h-3 w-3" /></Button></Link>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDel(t._id)} disabled={delId === t._id}>
                      {delId === t._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" disabled={pagination.page <= 1} onClick={() => dispatch(setPage(pagination.page - 1))}><ChevronLeft className="h-3.5 w-3.5" /></Button>
          <span className="text-xs text-slate-500">Page {pagination.page}/{pagination.totalPages}</span>
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" disabled={pagination.page >= pagination.totalPages} onClick={() => dispatch(setPage(pagination.page + 1))}><ChevronRight className="h-3.5 w-3.5" /></Button>
        </div>
      )}
    </motion.div>
  );
};

export default TicketListPage;
