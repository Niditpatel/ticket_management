const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// GET all tickets (with filters, search, and pagination)
router.get('/', async (req, res) => {
  const { status, priority, search, page = 1, limit = 8 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: 'i' };

  try {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 8));
    const skip = (pageNum - 1) * limitNum;

    // Use countDocuments instead of count for accuracy with filters
    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      Ticket.countDocuments(query).exec(),
    ]);

    res.json({
      tickets: tickets || [],
      pagination: {
        total: total || 0,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil((total || 0) / limitNum) || 1,
      },
    });
  } catch (err) {
    console.error('Fetch tickets error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET stats route - moved ABOVE /:id to prevent being caught as an ID
router.get('/stats', async (req, res) => {
  try {
    const total = await Ticket.countDocuments({});
    const open = await Ticket.countDocuments({ status: 'Open' });
    const inProgress = await Ticket.countDocuments({ status: 'In Progress' });
    const resolved = await Ticket.countDocuments({ status: 'Resolved' });
    
    res.json({ total, open, inProgress, resolved });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET single ticket
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('assignedTo', 'name email');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create ticket
router.post('/', async (req, res) => {
  const { title, description, priority, assignedTo } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const ticket = new Ticket({ title, description, priority, assignedTo: assignedTo === 'none_assigned' ? null : assignedTo });
    const newTicket = await ticket.save();
    const populated = await Ticket.findById(newTicket._id).populate('assignedTo', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update ticket
router.patch('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'assignedTo' && req.body[field] === 'none_assigned') {
           ticket[field] = null;
        } else {
           ticket[field] = req.body[field];
        }
      }
    });

    const updatedTicket = await ticket.save();
    const populated = await Ticket.findById(updatedTicket._id).populate('assignedTo', 'name email');
    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
