# Note di versione

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
