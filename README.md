CHATapp

Opis projekta
Cilj ovog projekta je implementacija full-stack chat aplikacije. Aplikacija omogućava
korisnicima da se priključe globalnom chatu, gdje mogu slati poruke koje će biti vidljive
svim ostalim korisnicima. Također, aplikacija omogućava slanje privatnih poruka između
korisnika.

Tehnologija
Za implementaciju projekta odabrana je tehnologija Node.js. Node.js je open-source
okruženje za izvođenje JavaScript koda na serverskoj strani. Ovo okruženje omogućava
izgradnju brzih i skalabilnih web aplikacija.
Struktura projekta
Projekt je organizovan u dva dijela - backend i frontend.

Grid
Sidebar – bootstrap, sve ostalo je css.

Backend
Backend dio aplikacije je implementiran koristeći Node.js i Express framework. Glavni fajl
backend-a je index.js. U ovom fajlu se postavljaju rute i definiraju akcije koje se
izvršavaju prilikom zahtjeva klijenta.
Backend koristi PostgreSQL bazu podataka za pohranu poruka,a online korisnici su
smješteni u privremenu varijablu. Komunikacija s bazom podataka se vrši korištenjem pg
modula. Treba naglasiti da je baza LOKALNA(PG ADMIN).
Također, u backend-u se koristi socket.io biblioteka za realtime komunikaciju između
servera i klijenata. Socket.io omogućava emitiranje i primanje događaja između servera i
klijenata u stvarnom vremenu.
U glavnom fajlu backend-a su implementirane sljedeće funkcionalnosti:
• Kada se korisnik priključi chatu, emitira se događaj "Client join". Server prima ime
korisnika i dodaje ga u online korisnike. Zatim se emitira događaj "Online users"
sa listom online korisnika.
• Kada korisnik pošalje poruku, server je sprema u bazu podataka i emitira je svim
korisnicima u sobi.
• Kada korisnik pošalje privatnu poruku, server koristi sobu s privatnim
identifikatorom za komunikaciju između korisnika.

Frontend
Frontend dio aplikacije je implementiran koristeći HTML, CSS i JavaScript. Glavni fajl
frontend-a je index.html. U ovom fajlu je definirana struktura stranice, stilizacija i
JavaScript kod za komunikaciju s backend-om putem Socket.io biblioteke.
Frontend aplikacije sadrži sljedeće elemente:
• Sidebar sa listom online korisnika.
• Glavni dio stranice koji prikazuje poruke.
• Polje za unos poruke.
• Dugme za slanje poruke.
Na frontend-u su implementirane sljedeće funkcionalnosti:
• Kada se korisnik priključi chatu, emitira se događaj "Client join" s korisničkim
imenom.
• Kada korisnik pošalje poruku, emitira se događaj "Message" s
korisničkim imenom i sadržajem poruke.
• Kada server emitira događaj "Online users", ažurira se lista online korisnika na
frontend-u.
• Kada server emitira događaj "Message", prikazuje se nova poruka na frontend-u.

Upute za pokretanje
Alat koji sam koristio za upravljanje projektom je github.
1. Preuzmite projekt s GitHub repozitorija.(“
https://github.com/hare19012/CHATapp.git”) – git clone
2. Instalirajte Node.js na svoje računalo, ako već nije instaliran.
3. U terminalu, navigirajte do mape projekta.
4. Izvršite naredbu npm install kako biste instalirali potrebne module.
5. Pokrenite aplikaciju izvršavanjem naredbe npm start. Moguće je da to uradite
izvršavanjem naredbe docker-compose up, jer je aplikacija zapakovana u docker
radi lakšeg pokretanja I na drugim računarima.
6. Otvorite pretraživač i posjetite http://localhost:3000 kako biste vidjeli aplikaciju.
Moguća poboljšanja
Ovaj projekt predstavlja osnovnu implementaciju chat aplikacije. Moguća poboljšanja
uključuju:
• Dodavanje autentifikacije korisnika kako bi se osiguralo da samo prijavljeni
korisnici mogu pristupiti chatu.
• Implementacija mogućnosti slanja slika i datoteka.
• Brisanje, lajkanje poruka.
Ovo su samo neki prijedlozi za poboljšanje, a mogućnosti su neograničene ovisno o
potrebama i zahtjevima projekta.
Napomena: U kodu se nalaze komentari koji opisuju svaku funkcionalnost.
