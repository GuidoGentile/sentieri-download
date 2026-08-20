# Note di versione

## 0.22.0 edizione Abruzzo e recupero tracce — 20 agosto 2026

- l’app utente adotta l’identificativo definitivo `it.sentieri.abruzzo`, separato dalla linea storica `it.sentieripnalm.mobile`;
- una build ponte aggiorna la vecchia app senza cancellarne il database e rende disponibili in sola lettura le tracce personali;
- la nuova app importa automaticamente le registrazioni dell’account proprietario verificato, le riunisce per sessione e applica nuovamente i filtri GPS correnti;
- Storico mostra un riscontro esplicito con il numero di tracce recuperate, da verificare prima di disinstallare la vecchia app;
- prenotazioni, recensioni, escursioni, copertura, eventi e altri contenuti dimostrativi non vengono trasferiti e la nuova installazione parte pulita;
- l’app Guardiaparco adotta l’identificativo coerente `it.sentieri.abruzzo.guardiaparco` e lo stesso marchio di Sentieri.

Ordine per chi possiede la 0.21 o una versione precedente: non disinstallare nulla, installare
`01-Ponte-Tracce-Sentieri.apk`, quindi `02-Sentieri-Abruzzo-0.22-arm64.apk`, aprire Storico nella nuova app e
controllare le tracce. Per una prima installazione è sufficiente il secondo APK. Le fotografie locali non
sono migrate perché i relativi indirizzi appartengono al vecchio spazio privato Android.

## 0.21.0 nuova identità visiva — 20 agosto 2026

- il nuovo marchio con impronta, montagna e sentiero sostituisce il simbolo provvisorio nel launcher, nello splash e nell'intestazione Android;
- `Sentieri` resta il nome principale, mentre *d'Abruzzo* appare in corsivo e con colore distinto come declinazione territoriale;
- landing, guida, favicon, console web e predisposizione dello splash iPhone usano la stessa identità;
- restano invariati catalogo, mappe offline, 679 attrazioni, registrazioni personali, account locale e flussi di prenotazione della 0.20.

La 0.21.0 mantiene application ID, certificato e database delle versioni precedenti. Installare
l'aggiornamento sopra Sentieri d’Abruzzo senza disinstallare l’app per conservare tracce, account locale
e dati offline.

## 0.20.0 attrazioni e mappa turistica — 20 agosto 2026

- debutta la sezione `Attrazioni` con 679 luoghi abruzzesi, ricerca per nome, comune, area e tag e filtri per categoria e destinazione;
- una mappa regionale mostra 28 aree turistiche con il relativo conteggio e, dopo la selezione, inquadra le singole attrazioni cliccabili;
- ogni scheda conserva un sito HTTPS ufficiale o istituzionale, provenienza e stato di validazione separato;
- eventuali gallerie caricano riferimenti fotografici online senza incorporare immagini nel database, nell’APK o nei pacchetti territoriali;
- le mappe dei sentieri e la navigazione continuano a funzionare offline: la sezione turistica è deliberatamente online e non indebolisce questa garanzia;
- la console gestore rende più evidenti le sezioni con schede in rilievo e mantiene sincronizzato lo stato della scheda selezionata;
- la landing adotta il messaggio “L’Abruzzo da vivere, passo dopo passo”.

La 0.20.0 mantiene application ID, certificato e database delle versioni precedenti. Installare
l'aggiornamento sopra Sentieri d’Abruzzo senza disinstallare l’app per conservare tracce, account locale
e dati offline.

## 0.19.0 catalogo abruzzese — 19 agosto 2026

- il catalogo cresce a 1.219 percorsi canonici dell'Abruzzo, organizzati per destinazioni e aree senza pubblicare doppioni geometrici come schede separate;
- 334 percorsi conservano un'identità CAI documentata e riconoscibile, distinta dalla validazione del gestore;
- fonti e varianti storiche restano collegate al percorso padre più autorevole: gestore validato, fonte ufficiale, CAI diretto, CAI attribuito, OpenStreetMap e altre fonti;
- la scala della pendenza assoluta diventa celeste 0–5%, verde 5–10%, giallo 10–15%, arancio 15–20% e rosso dal 20% in su, identica su mappa, profili e legenda;
- la console gestore espone il catalogo regionale multi-ente, calendari, capienze, prenotazioni, abilitazione delle Guardie e registro dei controlli;
- debutta la beta Android separata `Guardiaparco` per accesso di servizio, scansione QR, verifica del titolo e consultazione dei controlli recenti;
- viene predisposto il formato versionato dei pacchetti territoriali scaricabili una volta e utilizzabili offline, mantenendo fotografie e contenuti pesanti fuori dal catalogo di base.

La 0.19.0 mantiene application ID, certificato e database delle versioni precedenti. Installare
l'aggiornamento senza disinstallare Sentieri per conservare tracce, account locale e dati offline.

## 0.18.0 rifinitura interfaccia — 19 agosto 2026

- i comandi livelli, nord e posizione corrente restano allineati, leggermente piu grandi e con uno sfondo semitrasparente discreto;
- l'apertura del pannello livelli non sposta piu i comandi sottostanti;
- la linguetta del profilo chiusa occupa tutta la larghezza e il suo fondo copre correttamente l'area inferiore del telefono;
- Copertura usa la mappa fino al bordo inferiore e rende omogenei e leggibili i testi della scheda riepilogativa;
- Registra riusa per piedi, bicicletta, e-bike e cavallo gli stessi simboli adottati nei filtri del catalogo;
- prosegue la preparazione del progetto iPhone con catalogo, panoramica, mappe, profilo, registrazione e storico; il pacchetto iOS verra distribuito soltanto dopo compilazione e firma su Mac.

Gli APK mantengono application ID e certificato delle versioni precedenti e hanno un codice versione
crescente: installare l'aggiornamento senza disinstallare Sentieri per conservare dati e tracce locali.

## 0.17.0 correzioni dal campo — 18 agosto 2026

- eliminato il doppio avvio: resta soltanto lo splash riconoscibile con la scritta `Sentieri`;
- le tracce recuperate e appena concluse eliminano in modo prudente le soste iniziali e finali prolungate e l'eventuale coda in automobile successiva a una sosta, conservando sempre una bozza in caso di dubbio;
- le tracce personali si possono rinominare e aprono ora una panoramica statica, dalla quale si accede alla mappa dinamica e al profilo dedicato;
- la mappa dinamica ha i comandi per ripristinare il nord e centrare la posizione; cime e valichi sono un livello autonomo, sempre leggibile sopra i boschi, mentre la rete dei percorsi circostanti usa un tratteggio rosso;
- la linguetta del profilo, la legenda delle pendenze e gli altri comandi rispettano l'area riservata alla barra di navigazione del telefono;
- calendario delle prenotazioni più compatto, con giorno e disponibilità nettamente distinti;
- inserimento della data di nascita con barre automatiche e simboli più chiari per dislivello e mezzi di percorrenza;
- Informazioni → App riporta il nome e il codice esatti della versione installata.

Gli APK mantengono identità e firma delle versioni precedenti: l'aggiornamento va installato senza
disinstallare Sentieri, così Android conserva tracce, account locale e mappe offline.

## 0.16.0 recupero account — 18 agosto 2026

- la sincronizzazione delle registrazioni personali è ora bidirezionale: l'app invia le modifiche locali e recupera le tracce già presenti nel proprio spazio Supabase;
- i punti recuperati ricostruiscono mappa, distanza ed esagoni nel database SQLite del telefono;
- la fusione è prudente: la revisione più recente prevale, una copia remota vecchia non può sostituire quella locale e l'assenza sul server non provoca cancellazioni;
- la pagina Account mostra ultimo esito, elementi inviati, recuperati o ancora in attesa e offre il comando `Sincronizza ora`;
- Informazioni → App mostra nome e codice esatti della versione installata;
- una registrazione remota rimasta attiva viene recuperata come bozza, evitando di riavviare silenziosamente il GPS;
- application ID e certificato restano identici alla 0.15; il `versionCode` sale a 26 e l'aggiornamento è stato provato sopra la 0.14 conservando database e preferenze.

Questa versione recupera l'identità anonima già presente sullo stesso telefono. Il collegamento Google
per il recupero su un dispositivo nuovo è ancora da realizzare. Le fotografie allegate restano locali:
il backup remoto riguarda per ora metadati della registrazione e punti GPS.

## 0.15.0 nucleo accessi — 18 agosto 2026

- introdotto su Supabase il nucleo ente → prodotto → regime → calendario → capienza → prenotazione → titolo;
- importati come prodotti territoriali tutti i 155 percorsi del catalogo unificato, conservando fonte, ufficialità e validazione come dati distinti;
- il percorso pilota A1 usa calendario remoto con giorni liberi, chiusi o prenotabili e capienza da 1 a 999;
- disponibilità e prenotazione sono verificate nella stessa transazione; una chiave di idempotenza impedisce doppie richieste involontarie;
- una prenotazione gratuita confermata genera un titolo separato e un QR che non contiene dati personali;
- l'app dichiara i percorsi non ancora configurati invece di mostrare disponibilità inventate;
- la console locale può collegarsi con l'account gestore autorizzato, modificare il catalogo, configurare giornate e leggere prenotazioni; senza login resta una demo locale dichiarata.

Sono pubblicati l'aggiornamento ARM64 leggero e l'APK completo con le cinque basi cartografiche offline.
Il nuovo flusso serve al collaudo tecnico: non costituisce ancora un permesso ufficiale del Parco.

## 0.14.0 backup tracce — 18 agosto 2026

- SQLite resta la destinazione immediata e autorevole di ogni registrazione, anche senza rete;
- quando la connessione torna disponibile, l'app crea un'identità Supabase anonima autenticata e invia una copia privata della sessione e dei suoi punti;
- la sincronizzazione è idempotente, conserva revisioni ed errori e non cancella mai la copia presente sul telefono;
- RLS limita ogni traccia al proprietario e nell'APK entra soltanto la chiave pubblicabile, mai una chiave amministrativa;
- la cartografia offline completa è stata ripristinata con sfondo, etichette, idrografia, cime, valichi e curve di livello;
- i 155 percorsi dell'app formano un livello verde autonomo; il percorso aperto conserva la colorazione assoluta della pendenza e Copertura usa esagoni fucsia semitrasparenti;
- profili e mappe condividono la scala blu, celeste, verde, giallo, arancio, rosso e viola alle soglie 5, 10, 15, 20, 25 e 30%;
- il calendario di prenotazione distingue giorni prenotabili, liberi, chiusi ed esauriti, con residui fino a 999 più leggibili.

Sono pubblicati due APK ARM64: l'aggiornamento leggero `Sentieri-Android-demo.apk`, da installare
sopra Sentieri senza disinstallare, e `Sentieri-Android-full.apk` per una prima installazione con
cartografia completa. La sincronizzazione riguarda per ora soltanto le tracce personali; account
social, prenotazioni, recensioni e console gestore restano locali o dimostrativi.

## 0.13.0 recupero tracce — 17 agosto 2026

- ogni punto GPS valido viene scritto subito nel database locale e resta disponibile offline;
- i salti che implicherebbero più di 50 km/h vengono scartati prima di alterare mappa, distanza o copertura;
- all'aggiornamento la stessa pulizia viene applicata alle registrazioni personali già conservate;
- frammenti compatibili della stessa uscita vengono riuniti con criteri prudenti, mentre i casi dubbi restano bozze separate;
- una registrazione attiva della giornata viene proposta per la prosecuzione prima di iniziarne una nuova;
- lo Storico distingue tracce recuperate e stato della futura copia online;
- client Supabase e coda idempotente sono predisposti, ma questo APK di recupero non contiene ancora la configurazione dell'account remoto.

La 0.13.0 è un aggiornamento ARM64 leggero da installare **sopra** Sentieri senza disinstallare
l'app: la firma è la stessa e Android conserva database, tracce e pacchetti cartografici già estratti.
È consigliabile aprire `Registra` e poi `Storico` subito dopo l'aggiornamento. Una bozza recuperata è
preferibile a un frammento perso; eventuali doppioni potranno essere corretti in seguito.

## 0.12.1 correzione mappa — 17 agosto 2026

- il rosso è riservato alla rete ufficiale nella sola pagina Copertura;
- nelle mappe dei sentieri la rete circostante resta verde e la salita molto ripida usa il viola;
- la pagina cartografica arriva fino al bordo inferiore senza la fascia bianca del sistema;
- la linguetta chiusa del profilo è più bassa e arrotondata su tutti i lati.

La 0.12.1 è un aggiornamento ARM64 leggero da installare sopra la 0.12.0 completa dopo avere aperto
almeno una mappa. Conserva i dati territoriali già estratti sul telefono.

## 0.12.0 completamento collaudo — 17 agosto 2026

- splash iniziale con il nome Sentieri in grande sopra il simbolo dell'app;
- Copertura e anteprime cartografiche non chiudono più l'app quando il pacchetto offline completo non è installato: mostrano una base minima con i percorsi PNALM;
- pacchetto cartografico di contesto ridotto a 100 km e APK completo ridotto a circa 259 MiB;
- sfondi illustrati astratti e leggeri nelle card dei percorsi;
- codici compatti nelle viste specialistiche, profilo chilometrico colorato per pendenza assoluta e nomi dei punti notevoli;
- mappa dinamica stabilizzata, pannello layer richiudibile e cime visibili dal livello delle curve direttrici;
- permessi futuri con QR Code offline, pulsante Prenota nella panoramica e recensioni con media;
- copertura con rete PNALM rossa ed esagoni fucsia semitrasparenti;
- rete rossa più sottile e limitata alla sola Copertura; nelle mappe dei sentieri la rete circostante resta verde;
- linguetta del profilo dinamico più compatta, senza fascia bianca inutilizzata;
- account con selfie/galleria, finestra dedicata per cercare e scegliere una nazionalità ISO con bandiera, e data di nascita corretta;
- apertura delle tracce private dallo Storico con mappa, profilo, dislivelli ed energia.
- console gestore ampliata con elenco modificabile dei percorsi, calendario delle capienze, disponibilità residue e lista delle prenotazioni.

Questa versione è stata compilata e collaudata sull'emulatore. L'APK completo è firmato con la stessa
chiave debug delle versioni precedenti ed è quindi compatibile con gli aggiornamenti sul telefono.

## 0.11.5 correzione copertura — 16 agosto 2026

- i piccoli buchi tra posizioni GPS affidabili vengono cuciti campionando il segmento ogni 25 metri;
- la correzione è limitata a 3 minuti, 450 metri e velocità compatibile con il mezzo;
- le celle corrette automaticamente restano distinguibili nel database da quelle osservate direttamente;
- soltanto gli esagoni dei percorsi ufficiali PNALM aumentano copertura, titoli e classifica;
- i titoli delle pagine principali sono ora centrati senza essere spostati dalle icone laterali.

## 0.11.4 icona provvisoria — 16 agosto 2026

- l'icona Android predefinita è sostituita dal simbolo provvisorio già usato nell'app;
- sono disponibili icona adattiva, rotonda e monocromatica per i diversi launcher Android;
- nella pagina del percorso la fonte è accanto alla difficoltà e non interferisce più con Avvia;
- Avvia usa ora una freccia piena, arrotondata e inclinata verso destra.

## 0.11.3 esagoni ufficiali — 16 agosto 2026

- `Nuovi esagoni` conta soltanto celle appartenenti ai percorsi ufficiali PNALM;
- una cella fuori dalla rete ufficiale resta nella traccia personale, ma non aumenta copertura, titolo o classifica;
- conclusione della registrazione, Storico e pagina Copertura usano ora la stessa maschera geografica ufficiale.

## 0.11.2 nuovi esagoni — 16 agosto 2026

- la registrazione personale mostra `Nuovi esagoni` invece del totale generico;
- il conteggio include soltanto le celle aggiunte per la prima volta alla copertura dell'utente;
- gli esagoni già visitati in sessioni precedenti non vengono conteggiati nuovamente;
- lo stesso valore compare nella relativa scheda dello Storico.

## 0.11.1 foto private — 16 agosto 2026

- fino a 5 fotografie allegabili alla conclusione di una registrazione personale;
- anteprima e rimozione delle immagini prima del salvataggio;
- fotografie conservate localmente e mostrate nella relativa scheda dello Storico;
- aggiornamento compatibile con le registrazioni già presenti nel database;
- aggiornamento ARM64 di circa 30 MB che mantiene i dati cartografici già estratti dalla 0.11.0;
- nuova build distinta dalla 0.11.0 per rendere verificabile l'aggiornamento sul telefono.

Le fotografie dei percorsi personali non vengono pubblicate e gli originali restano nella galleria
del dispositivo. Questa build è destinata ai telefoni Android ARM64 moderni e deve essere installata
sopra la 0.11.0 senza disinstallarla; prima dell'aggiornamento va aperta almeno una mappa affinché i
dati offline siano estratti. Il pacchetto completo 0.11.0 resta disponibile per la prima installazione.
La sincronizzazione remota dei contenuti personali non è ancora attiva.

## 0.11.0 prova GPS — 15 agosto 2026

- catalogo offline con 155 percorsi candidati e provenienza PNALM/CAI conservata;
- cartografia vettoriale offline con etichette, curve di livello, cime, valichi e livelli selezionabili;
- panoramica del percorso, mappa dinamica e profilo altimetrico scorrevole e sincronizzato;
- pendenza rappresentata con gli stessi colori sulla traccia e sul profilo;
- dislivelli, punti notevoli, chilometri equivalenti di fatica e calorie stimate dal DEM TINITALY;
- registrazione di percorsi personali privati per piedi, bici, e-bike e cavallo;
- mappa GPS dal vivo, frequenza configurabile e servizio predisposto per continuare a schermo spento;
- salvataggio nello Storico oppure cancellazione completa con conferma di traccia, punti GPS ed esagoni;
- arresto prudente e documentato delle registrazioni dimenticate;
- copertura geografica a esagoni da 100 metri sui 131 percorsi ufficiali PNALM, con 5.097 celle uniche;
- titoli progressivi e prima classifica dimostrativa;
- account locale di prova, calendario, prenotazioni simulate, storico e recensioni legate alle uscite;
- prima console gestore pubblica per identità, palette, area cartografica e governo di duplicati e varianti.

### Limiti

Il GPS in background e le regole di arresto devono essere validati con prove reali sul campo.
Account, prenotazioni, classifica e contenuti personali non sono ancora collegati a un servizio remoto.
Non sono operativi meteo live, navigazione con avvisi, pagamenti, QR, app Guardia Parco o editor GIS
completo. La console gestore non ha ancora autenticazione e salva le modifiche soltanto nel browser.
L’APK resta una build debug fuori da Google Play e non deve essere usato come unico strumento di
navigazione o sicurezza.

## 0.6.0 demo — 14 agosto 2026

- catalogo offline con 155 percorsi candidati e provenienza PNALM/CAI;
- card compatte, preferiti, ricerca e filtri dedicati;
- dettaglio percorso, mappa dimostrativa e profilo altimetrico TINITALY;
- modalità a piedi, bici, e-bike e cavallo distinte;
- menu diretto con Prenotazioni, Calendario, Account, Storico, Copertura e Informazioni;
- profilo locale con foto, data di nascita, genere, nazionalità e peso facoltativo;
- modello documentato per copertura, recensioni, meteo, allerte e avvisi del gestore.

### Limiti

La navigazione GPS, le prenotazioni, gli account remoti, gli avvisi meteo live e
la cartografia vettoriale offline completa non erano ancora operativi. L’APK restava
una build debug per valutazione e non una distribuzione Play Store.

## 0.1.0 demo — 13 agosto 2026

Prima pubblicazione dimostrativa di Sentieri.

- landing page pubblica ottimizzata per desktop e mobile;
- APK Android installabile fuori dal Play Store;
- schermata Android introduttiva con stato reale delle funzioni;
- modello multi-parco e dominio degli accessi documentati;
- console gestore, app Guardia e portale verbali presentati come sviluppi futuri.

### Limiti

L’APK era una build debug per valutazione e non conteneva ancora funzioni operative. Non era firmato
per la distribuzione Play Store e poteva richiedere l’autorizzazione temporanea all’installazione da
origini esterne.
