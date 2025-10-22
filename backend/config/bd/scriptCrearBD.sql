create database sat_totem;

use sat_totem;

create table facturas_impresas(
	id_factura_impresa serial primary key,
	codigo_inmueble integer,
	periodo_factura integer,
	numero_factura integer,
	fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	cantidad_impresion integer
)

create table total_facturas_impresas(
	cantidad_total integer
)