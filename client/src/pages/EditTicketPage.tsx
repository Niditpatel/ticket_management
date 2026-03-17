import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store';
import { updateTicket } from '../store/ticketSlice';
import { fetchUsers } from '../store/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import api from '../api';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const EditTicketPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users } = useSelector((s: RootState) => s.users);
  const [form, setForm] = useState({ title: '', description: '', status: 'Open', priority: 'Medium', assignedTo: 'none_assigned' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    if (!id) return;
    api.get(`/tickets/${id}`).then(r => {
      const t = r.data;
      setForm({ title: t.title, description: t.description || '', status: t.status, priority: t.priority, assignedTo: t.assignedTo?._id || 'none_assigned' });
    }).catch(() => { alert('Ticket not found'); navigate('/'); }).finally(() => setLoading(false));
  }, [id, dispatch, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.assignedTo === 'none_assigned') (payload as any).assignedTo = null;
      await dispatch(updateTicket({ id: id!, data: payload })).unwrap();
      navigate('/');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-sm text-slate-400"><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
      <h1 className="text-lg font-bold text-slate-800 mb-4">Edit Ticket</h1>
      <form onSubmit={submit} className="border border-border/60 rounded-xl bg-white overflow-hidden">
        <div className="p-4 space-y-3">
          <div><Label className="text-xs font-medium text-slate-600">Title</Label><Input className="mt-1 h-9 text-sm rounded-lg" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label className="text-xs font-medium text-slate-600">Description</Label><Textarea className="mt-1 text-sm rounded-lg min-h-[80px] resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-600">Status</Label>
              <Select onValueChange={v => setForm({ ...form, status: v })} value={form.status}>
                <SelectTrigger className="mt-1 h-9 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Open">Open</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Resolved">Resolved</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600">Priority</Label>
              <Select onValueChange={v => setForm({ ...form, priority: v })} value={form.priority}>
                <SelectTrigger className="mt-1 h-9 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600">Assignee</Label>
              <Select onValueChange={v => setForm({ ...form, assignedTo: v })} value={form.assignedTo}>
                <SelectTrigger className="mt-1 h-9 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="none_assigned">Unassigned</SelectItem>{users.map(u => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-border/40 bg-slate-50/50 px-4 py-3">
          <Button variant="ghost" type="button" size="sm" onClick={() => navigate('/')} className="text-xs">Cancel</Button>
          <Button type="submit" size="sm" className="text-xs px-6" disabled={saving}>
            {saving && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}{saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
export default EditTicketPage;
