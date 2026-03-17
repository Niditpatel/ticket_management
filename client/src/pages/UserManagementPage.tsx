import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { fetchUsers, createUser } from '../store/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Mail, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagementPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((s: RootState) => s.users);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSaving(true);
    try { await dispatch(createUser(form)).unwrap(); setForm({ name: '', email: '' }); }
    catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h1 className="text-lg font-bold text-slate-800">Users</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="border border-border/60 rounded-xl bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-slate-50/50 text-xs font-semibold text-slate-600 flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" />Add Member</div>
          <form onSubmit={submit} className="p-4 space-y-3">
            <div><Label className="text-xs text-slate-600">Name</Label><Input placeholder="Jane Smith" className="mt-1 h-9 text-sm rounded-lg" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label className="text-xs text-slate-600">Email</Label><Input type="email" placeholder="jane@co.com" className="mt-1 h-9 text-sm rounded-lg" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <Button type="submit" size="sm" className="w-full text-xs" disabled={saving}>{saving && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}{saving ? 'Adding...' : 'Add Member'}</Button>
          </form>
        </div>
        {/* Table */}
        <div className="lg:col-span-2 border border-border/60 rounded-xl bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-slate-50/50 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600">Team</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{users.length}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40">
                <TableHead className="h-8 text-[10px] uppercase tracking-wider font-semibold text-slate-500 pl-4">Name</TableHead>
                <TableHead className="h-8 text-[10px] uppercase tracking-wider font-semibold text-slate-500">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={2} className="text-center py-8 text-xs text-slate-400"><Loader2 className="w-4 h-4 animate-spin inline mr-1" />Loading...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={2} className="text-center py-8 text-xs text-slate-400">No members yet.</TableCell></TableRow>
              ) : users.map(u => (
                <TableRow key={u._id} className="border-b border-border/30">
                  <TableCell className="py-2 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{u.name.charAt(0).toUpperCase()}</div>
                      <span className="text-sm font-medium text-slate-800">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3 opacity-40" />{u.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
};
export default UserManagementPage;
