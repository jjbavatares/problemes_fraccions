# Problemes amb fraccions

Web educativa en català per a Matemàtiques de 2n d’ESO.

- **Aprèn:** 9 tipus de problemes, amb esquemes i exemples resolts amb l’estructura Dades / Resolució / Solució.
- **Practica:** 10 problemes amb solució visible i resolució pas a pas desplegable.
- **Col·lecció:** 30 problemes variats de dificultat creixent. Enunciats i solucions visibles; resolucions xifrades en tres blocs independents de 10.

## Utilització

Obre `index.html` amb un navegador actual o accedeix a la versió de GitHub Pages. També funciona sense connexió.

A Col·lecció, el botó discret **Accés**, al peu de la pàgina, permet introduir la clau d’un bloc. Les resolucions s’obren individualment. Recarregar la pàgina les torna a bloquejar; també es poden bloquejar totes des del diàleg d’accés.

El progrés de la pestanya Practica es desa només al navegador. No es desen contrasenyes ni resolucions desxifrades.

## Fitxers

- `data.js`: exemples i problemes de pràctica.
- `collection.js`: enunciats i respostes públics, més els tres blocs de resolucions xifrades.
- `app.js` i `collection-ui.js`: navegació, fraccions verticals i desbloqueig.
- `styles.css`: disseny fosc, adaptació al mòbil i impressió.
- `assets/`: logotip de JJB Avatares con IA i icona.

No necessita biblioteques, serveis externs ni compilació. Les multiplicacions es mostren amb punt i les divisions, com a fraccions.

## Resolucions protegides

AES-256-GCM amb PBKDF2-SHA-256, sal aleatòria i 250.000 iteracions. Les claus són una barrera didàctica; aquest sistema no substitueix una autenticació forta. Les claus i les resolucions originals sense xifrar no formen part del repositori.

## Verificació

S’han comprovat els resultats amb aritmètica racional exacta, incloses 108 cadenes d’igualtats dels 30 problemes. També s’han provat la navegació, el mòbil, el funcionament sense connexió, les claus incorrectes, la independència dels blocs i el rebloqueig.
