function isValidCombo(combo) {

	// --- Rule 1: Reject 4+ consecutive numbers ---
	let consecutiveCount = 1;

	for (let i = 1; i < combo.length; i++) {

		if (combo[i] === combo[i - 1] + 1) {
			consecutiveCount++;

			if (consecutiveCount >= 4) {
				return false;
			}
		} else {
			consecutiveCount = 1;
		}
	}

	// --- Rule 2: Reject all odd or all even ---
	let oddCount = 0;

	for (const num of combo) {

		if (num % 2 !== 0) {
			oddCount++;
		}
	}

	if (oddCount === 0 || oddCount === combo.length) {
		return false;
	}

	// --- Rule 3: Reject arithmetic sequences ---
	const gap = combo[1] - combo[0];
	let isArithmetic = true;

	for (let i = 2; i < combo.length; i++) {

		if (combo[i] - combo[i - 1] !== gap) {
			isArithmetic = false;
			break;
		}
	}

	if (isArithmetic) {
		return false;
	}

	return true;
}


function getRandomTicket() {

	while (true) {

		const numbers = [];

		while (numbers.length < 6) {

			const next = Math.floor(Math.random() * 49) + 1;

			if (!numbers.includes(next)) {
				numbers.push(next);
			}
		}

		const sorted = numbers.sort((a, b) => a - b);

		// Only return valid combos
		if (isValidCombo(sorted)) {

			return sorted
				.map((n) => n.toString().padStart(2, '0'))
				.join(' ');
		}
	}
}

// DOM wiring and rendering
window.addEventListener('DOMContentLoaded', () => {
	const ticketCountInput = document.getElementById('ticketCount');
	const generateButton = document.getElementById('generateButton');
	const clearButton = document.getElementById('clearButton');
	const ticketsContainer = document.getElementById('tickets');

	function renderTickets(count) {
		ticketsContainer.innerHTML = '';

		for (let i = 1; i <= count; i += 1) {
			const ticketEl = document.createElement('div');
			ticketEl.className = 'ticket';

			const title = document.createElement('div');
			title.className = 'ticket-title';
			title.textContent = `Ticket ${i}`;

			const numbers = document.createElement('div');
			numbers.className = 'numbers';
			numbers.textContent = getRandomTicket();

			ticketEl.appendChild(title);
			ticketEl.appendChild(numbers);
			ticketsContainer.appendChild(ticketEl);

			// Staggered reveal
			setTimeout(() => ticketEl.classList.add('show'), (i - 1) * 70);
		}
	}

	generateButton.addEventListener('click', () => {
		const requestedCount = parseInt(ticketCountInput.value, 10);

		if (Number.isNaN(requestedCount) || requestedCount < 1) {
			ticketCountInput.value = '1';
			renderTickets(1);
			return;
		}

		const count = Math.min(requestedCount, 100);
		renderTickets(count);
	});

	// Clear button: remove rendered tickets and reset input
	if (clearButton) {
		clearButton.addEventListener('click', () => {
			ticketsContainer.innerHTML = '';
			ticketCountInput.value = '';
			ticketCountInput.focus();
		});
	}

	// Allow pressing Enter in the input to generate tickets
	ticketCountInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			generateButton.click();
		}
	});

	// Clear, focus and select the input when the page opens
	ticketCountInput.value = '';
	ticketCountInput.focus();
	ticketCountInput.select();
});