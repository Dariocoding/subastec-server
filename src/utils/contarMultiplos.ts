export const contarMultiplos = (data: { multiplo: number; cantidad: number }) => {
	let cantidadMultiplos = 1;
	let cantidadMultiplosActual = data.multiplo;
	while (cantidadMultiplosActual < data.cantidad) {
		cantidadMultiplosActual += data.multiplo;
		cantidadMultiplos++;
	}
	return cantidadMultiplos;
};
