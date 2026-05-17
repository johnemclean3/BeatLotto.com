function isValidCombo(combo) {

	// --- Consecutive checks ---
	let consecPairs = 0;
	let i = 0;

	while (i < 5) {
		let length = 1;

		while (i + 1 < 6 && combo[i + 1] === combo[i] + 1) {
			length += 1;
			i += 1;
		}

		// Block runs of 3+
		if (length >= 3) {
			return false;
		}

		// Count pairs
		if (length === 2) {
			consecPairs += 1;
		}

		i += 1;
	}

	// More than one consecutive pair
	if (consecPairs > 1) {
		return false;
	}


	// --- Multiples checks ---
	let multiplePairs = 0;
	const n = combo.length;

	for (let i = 0; i < n; i++) {

		for (let j = i + 1; j < n; j++) {

			const a = combo[i];
			const b = combo[j];

			// Avoid divide by zero
			if (a !== 0 && b % a === 0) {

				let count = 2;

				for (let k = j + 1; k < n; k++) {

					if (combo[k] % a === 0) {
						count += 1;
					}
				}

				// Block 3+ multiples
				if (count >= 3) {
					return false;
				}

				// Count pairs
				if (count === 2) {
					multiplePairs += 1;

					if (multiplePairs > 1) {
						return false;
					}
				}
			}
		}
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