const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  message:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;