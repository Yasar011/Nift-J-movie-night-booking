const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Serve static files
app.use(express.static('C:\\Users\\HP\\Desktop\\movie wb'));

// Load seats.json
let seats = JSON.parse(fs.readFileSync('seats.json', 'utf8'));

// Fetch seats
app.get('/seats', (req, res) => {
    res.json(seats);
});

// Book a seat
app.post('/book-seat', (req, res) => {
    const { row, col, name, email, department, semester } = req.body;

    // Check if seat is already booked
    if (seats[row][col] && seats[row][col].occupied) {
        return res.status(400).json({ message: 'Seat already booked' });
    }

    // Book the seat
    seats[row][col] = {
        occupied: true,
        name,
        email,
        department,
        semester
    };
    fs.writeFileSync('seats.json', JSON.stringify(seats, null, 2));
    res.json({ message: 'Seat booked successfully' });
});

// Reset all seats
app.post('/reset-seats', (req, res) => {
    seats = seats.map(row => row.map(seat => false));
    fs.writeFileSync('seats.json', JSON.stringify(seats, null, 2));
    res.json({ message: 'All seats reset' });
});

// Delete a booking
app.post('/delete-booking', (req, res) => {
    const { row, col } = req.body;

    if (seats[row] && seats[row][col] && seats[row][col].occupied) {
        seats[row][col] = false;  // Reset the seat to unbooked
        fs.writeFileSync('seats.json', JSON.stringify(seats, null, 2));
        return res.json({ message: 'Booking deleted successfully' });
    }
    res.status(400).json({ message: 'Invalid seat or seat not booked' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`https://nift-j-movie-night-booking-fhr56j396-yasar-c-hs-projects.vercel.app/`);
});
