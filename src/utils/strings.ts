export const Token = (length: number = 15): string => {
	const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	let b = [];
	for (var i = 0; i < length; i++) {
		const j = (Math.random() * (a.split('').length - 1)).toFixed(0);
		b[i] = a[j];
	}
	return b.join('');
};

export const crearURLAmigable = (slug: string) => {
	slug = slug.toString();
	// Reemplaza los carácteres especiales | simbolos con un espacio
	slug = slug.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();

	// Corta los espacios al inicio y al final del sluging
	slug = slug.replace(/^\s+|\s+$/gm, '');

	// Reemplaza el espacio con guión
	slug = slug.replace(/\s+/g, '-');

	return slug;
};

export const controlDecimal = string =>
	string
		.replace(/\D/g, '')
		.replace(/([0-9])([0-9]{2})$/, '$1.$2')
		.replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ',');

export const convertToFloat = string => {
	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	function replaceAll(str, find, replace) {
		return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}
	return parseFloat(replaceAll(string, ',', ''));
};

export const MESES = () => [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];

export const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
