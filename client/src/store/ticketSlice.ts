import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo?: { _id: string; name: string; email: string };
  createdAt: string;
}

export interface TicketStats { total: number; open: number; inProgress: number; resolved: number; }
export interface Pagination { total: number; page: number; limit: number; totalPages: number; }
interface Filters { status: string; priority: string; search: string; }

interface TicketState {
  tickets: Ticket[];
  stats: TicketStats;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  filters: Filters;
}

const initialState: TicketState = {
  tickets: [],
  stats: { total: 0, open: 0, inProgress: 0, resolved: 0 },
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  loading: false,
  error: null,
  filters: { status: '', priority: '', search: '' },
};

export const fetchTickets = createAsyncThunk('tickets/fetch', async (params: any) => {
  const clean: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => { if (v !== '' && v != null) clean[k] = String(v); });
  const res = await api.get(`/tickets?${new URLSearchParams(clean)}`);
  return res.data;
});

export const fetchTicketStats = createAsyncThunk('tickets/stats', async () => {
  const res = await api.get('/tickets/stats');
  return res.data;
});

export const createTicket = createAsyncThunk('tickets/create', async (data: any) => {
  const res = await api.post('/tickets', data);
  return res.data;
});

export const updateTicket = createAsyncThunk('tickets/update', async ({ id, data }: { id: string; data: any }) => {
  const res = await api.patch(`/tickets/${id}`, data);
  return res.data;
});

export const deleteTicket = createAsyncThunk('tickets/delete', async (id: string) => {
  await api.delete(`/tickets/${id}`);
  return id;
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => { state.loading = true; })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets || [];
        if (action.payload.pagination) state.pagination = action.payload.pagination;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed';
      })
      .addCase(fetchTicketStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(t => t._id !== action.payload);
      });
  },
});

export const { setFilters, setPage } = ticketSlice.actions;
export default ticketSlice.reducer;
