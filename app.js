import { fetchMovieAvailability, fetchMovieList } from './api.js';

const selectedSeat = new Set();

const renderLoader = () => {

const div = document.createElement('div');

div.id = 'loader';

const p = document.createElement('p');

const text = document.createTextNode('Loading...');

p.appendChild(text);

div.appendChild(p);

const main = document.getElementsByTagName('main')[0];

main.appendChild(div);

};

const removeLoader = () => {

const main = document.getElementsByTagName('main')[0];

main.removeChild(main.firstElementChild);

};

const seatDataTransform = (seatData) => {

const data = {};

seatData.forEach((item) => {

data[item] = true;

});

return data;

};

const removeGrid = () => {

const element = document.getElementById('booker-grid-holder');

let child = element.firstElementChild;

while (child) {

child.remove();

child = element.firstElementChild;

}

};

function mySubmitFunction() {

console.log('here');

return false;

}

const clearBooker = () => {

const element = document.getElementById('booker');

let child = element.firstElementChild;

while (child) {

child.remove();

child = element.firstElementChild;

}

};

const renderSuccess = (email, phone) => {

clearBooker();

const element = document.getElementById('booker');

const div = document.createElement('div');

const h3 = document.createElement('h3');

const headingText = document.createTextNode('Booking details');

h3.appendChild(headingText);

div.appendChild(h3);

const p = document.createElement('p');

const seats = Array.from(selectedSeat);

const text = document.createTextNode(`Seats: ${seats.join(', ')}`);

p.appendChild(text);

div.appendChild(p);

const pEmail = document.createElement('p');

const emailText = document.createTextNode(email);

pEmail.appendChild(emailText);

div.appendChild(pEmail);

const pPhone = document.createElement('p');

const phoneText = document.createTextNode(phone);

pPhone.appendChild(phoneText);

div.appendChild(pPhone);

element.appendChild(div);

};

const bookingListener = (e) => {

clearBooker();

const element = document.getElementById('booker');

const confirmPurchase = document.createElement('div');

confirmPurchase.id = 'confirm-purchase';

const h3 = document.createElement('h3');

const seats = Array.from(selectedSeat);

const text = document.createTextNode(

`Confirm your booking for seat numbers:${seats.join(', ')}`

);

h3.appendChild(text);

confirmPurchase.appendChild(h3);

element.appendChild(confirmPurchase);

const formHolder = document.createElement('div');

const form = `

<form id="form-parent" onsubmit='return false;'>

<label for="fname">Email</label>

<input type="email" id="email" required name="fname"><br><br>

<label for="lname">Phone number</label>

<input type="tel" id="lname" required name="lname"><br><br>

<input id="book-ticket" type="submit" value="Submit">

</form>

`;

formHolder.innerHTML = form;

element.appendChild(formHolder);

const bookTicket = document.getElementById('book-ticket');

bookTicket.addEventListener('click', (e) => {

const email = document.getElementById('email').value;

const phone = document.getElementById('lname').value;

renderSuccess(email, phone);

});

};

const detachBookingClickListener = () => {

document

.getElementById('book-ticket-btn')

.removeEventListener('click', bookingListener);

};

const attachBookingClickListener = () => {

detachBookingClickListener();

document

.getElementById('book-ticket-btn')

.addEventListener('click', bookingListener);

};

const eventListener = (e) => {

const itemId = e.target.id;

const split = itemId.split('-');

if (split && split.length && split[0] == 'booking') {

if (selectedSeat.has(split[2])) {

selectedSeat.delete(split[2]);

e.target.classList.remove('selected-seat');

if (selectedSeat.size == 0) {

detachBookingClickListener();

document.getElementById('book-ticket-btn').classList.add('v-none');

}

} else {

selectedSeat.add(split[2]);

e.target.classList.add('selected-seat');

if (selectedSeat.size == 1) {

attachBookingClickListener();

document.getElementById('book-ticket-btn').classList.remove('v-none');

}

}

}

};

const detachGridClickListener = () => {

document

.getElementById('booker-grid-holder')

.removeEventListener('click', eventListener);

};

const attachGridClickListener = () => {

detachGridClickListener();

document

.getElementById('booker-grid-holder')

.addEventListener('click', eventListener);

};

const renderSeatGrid = (start, end, transformedSeats) => {

const element = document.getElementById('booker-grid-holder');

const gridParent = document.createElement('div');

gridParent.classList.add('booking-grid');

for (let i = start; i <= end; i++) {

const isSeatAvailable = transformedSeats[i];

const gridItem = document.createElement('div');

gridItem.innerHTML = `${i}`;

gridItem.id = `booking-grid-${i}`;

gridItem.classList.add('grid-item');

isSeatAvailable

? gridItem.classList.add('available-seat')

: gridItem.classList.add('unavailable-seat');

gridParent.appendChild(gridItem);

}

element.appendChild(gridParent);

};

const getSeats = async (name) => {

const element = document.getElementById('booker');

const h3 = element.firstElementChild;

const seats = await fetchMovieAvailability(name);

console.log(seats);

const transformedSeats = seatDataTransform(seats);

console.log(transformedSeats);

h3.classList.remove('v-none');

selectedSeat.clear();

removeGrid();

attachGridClickListener();

renderSeatGrid(1, 12, transformedSeats);

renderSeatGrid(13, 24, transformedSeats);

};

const renderMovies = (movies) => {

const main = document.getElementsByTagName('main')[0];

const mainDiv = document.createElement('div');

mainDiv.className = 'movie-holder';

main.appendChild(mainDiv);

movies.forEach((movie, idx) => {

const movieDiv = document.createElement('div');

movieDiv.className = 'movie-div';

movieDiv.onclick = () => {

const name = movie.name;

getSeats(name);

};

const dataView = `

<a class="movie- link" href="/moviename" onclick="return false;" >

<div class="movie" data- d="moviename">

<div id=mov${idx} class="movie-img-wrapper">

</div>

<h4>${movie.name}</h4>

</div>

</a>`;

movieDiv.innerHTML = dataView;

mainDiv.appendChild(movieDiv);

document.getElementById(

`mov${idx}`

).style.backgroundImage = `url(${movie.imgUrl})`;

});

};

const getMovies = async () => {

renderLoader();

const data = await fetchMovieList();

removeLoader();

renderMovies(data);

};

getMovies();
