import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store';
import { createTicket } from '../store/ticketSlice';
import { fetchUsers } from '../store/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const CreateTicketPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users } = useSelector((s: RootState) => s.users);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' as string, assignedTo: 'none_assigned' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.assignedTo === 'none_assigned') delete (payload as any).assignedTo;
      await dispatch(createTicket(payload)).unwrap();
      navigate('/');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
      <h1 className="text-lg font-bold text-slate-800 mb-4">Create Ticket</h1>
      <form onSubmit={submit} className="border border-border/60 rounded-xl bg-white overflow-hidden">
        <div className="p-4 space-y-3">
          <div><Label className="text-xs font-medium text-slate-600">Title *</Label><Input placeholder="Issue summary..." className="mt-1 h-9 text-sm rounded-lg" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label className="text-xs font-medium text-slate-600">Description</Label><Textarea placeholder="Details..." className="mt-1 text-sm rounded-lg min-h-[80px] resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-600">Priority</Label>
              <Select onValueChange={v => setForm({ ...form, priority: v })} defaultValue={form.priority}>
                <SelectTrigger className="mt-1 h-9 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600">Assign To</Label>
              <Select onValueChange={v => setForm({ ...form, assignedTo: v })}>
                <SelectTrigger className="mt-1 h-9 text-sm rounded-lg"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent><SelectItem value="none_assigned">Unassigned</SelectItem>{users.map(u => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-border/40 bg-slate-50/50 px-4 py-3">
          <Button variant="ghost" type="button" size="sm" onClick={() => navigate('/')} className="text-xs">Cancel</Button>
          <Button type="submit" size="sm" className="text-xs px-6" disabled={saving}>
            {saving && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}{saving ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
export default CreateTicketPage;
