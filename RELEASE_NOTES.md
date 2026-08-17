# Note di versione

## 0.12.1 correzione mappa — 17 agosto 2026

- il rosso è riservato alla rete ufficiale nella sola pagina Copertura;
- nelle mappe dei sentieri la rete circostante resta verde e la salita molto ripida usa il viola;
- la pagina cartografica arriva fino al bordo inferiore senza la fascia bianca del sistema;
- la linguetta chiusa del profilo è più bassa e arrotondata su tutti i lati.

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
