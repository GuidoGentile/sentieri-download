# Sentieri — download pubblico

Questo repository pubblico ospita la pagina di presentazione e le release dimostrative di Sentieri.

La sezione [`guida/`](guida/) contiene il manuale d'uso e la descrizione tecnica approfondita della
piattaforma. È pensata per gli utenti dell'app, per la presentazione a enti e potenziali clienti e come
base descrittiva dell'opera software, mantenendo distinti componenti realizzati, dimostrativi e pianificati.

## Android

La landing distribuisce due edizioni Android 0.45.0 ARM64 installabili insieme:

- `02-Sentieri-Abruzzo-0.45.0-arm64.apk`, release sperimentale Abruzzo;
- `Sentieri-Lazio-0.45.0-arm64.apk`, build candidata Lazio con dati territoriali separati.

La candidata Lazio usa `it.sentieri.lazio`, contiene 1.635 identità di percorso,
937 attrazioni qualificate da portali turistici istituzionali e 697
collegamenti fotografici remoti, una cartografia vettoriale offline costruita sull’ossatura OSM
con 14.514 nodi di catalogo, 61.310 nodi terziari e 57.610 archi terziari
escursionistici esplorabili. Esclude dal contesto marciapiedi, attraversamenti e
percorsi urbani non qualificati, mentre 14.636 tratti carrabili restano
rappresentati come viabilità distinta dai sentieri. Include inoltre il contesto
marino Tirreno/Adriatico derivato dai confini ISTAT 2026. Ogni edizione usa una
cartografia vettoriale offline estesa al proprio rettangolo di visualizzazione;
i raster fisici sono stati rimossi per evitare sovrapposizioni e peso inutile.
Le fonti CAI e ParchiLazio qualificano le identità quando la corrispondenza è
documentata; non rendono OpenStreetMap una fonte ufficiale. Profili e dislivelli
sono completi per 1.635 percorsi; le curve ogni 10 metri derivano da
TINITALY 1.1. Verifica diretta INFOMONT, continuità turn-by-turn, prova della
prova sul campo resta incompleta; la 0.45.0 è una candidata da verificare sul
telefono e sul territorio.

La release attuale è una **build sperimentale 0.45.0 ARM64**, distribuita fuori
dal Play Store per test controllati. L’APK contiene un catalogo offline di 1.162 percorsi
canonici abruzzesi, con 339 identità CAI documentate e fonti storiche conservate,
cartografia vettoriale offline, profili altimetrici e registrazione GPS predisposta per continuare
anche a schermo spento. Dal menu `Registra` si può creare un percorso personale privato e vederlo
crescere sulla mappa; al termine può essere completato con stelle, ricordo e fino a 5 foto private,
quindi salvato nello Storico o eliminato integralmente con
conferma. Il campionamento è configurabile tra 30 secondi, 1 minuto e 2 minuti. La quota
viene attribuita successivamente tramite DEM. I punti alimentano la copertura dei 131 percorsi
ufficiali PNALM, con percentuale, titoli progressivi e classifica dimostrativa. Il comportamento GPS
è stato provato sul campo in una prima registrazione reale. La 0.19.0 recupera registrazioni interrotte,
riunisce soltanto frammenti compatibili, scarta i salti GPS oltre 50 km/h e ripulisce con prudenza soste
prolungate agli estremi e code in automobile successive a una sosta. La copia
resta sul telefono e, quando torna la rete, viene copiata nell'identità privata su Supabase. Dalla pagina
`Account` si vede lo stato del backup, si può sincronizzare subito e si recuperano nel database locale
le tracce già inviate. Una copia remota più vecchia non sostituisce mai quella locale. Le tracce personali
si possono modificare nel nome, nel giudizio, nel ricordo e nelle foto, eliminare anche dal backup e consultare con la stessa sequenza panoramica, mappa dinamica e profilo. La mappa
offre inoltre ripristino del nord, centratura della posizione e livelli separati per cime e valichi.
Sul percorso pilota A1 anche calendario, capienza, prenotazione gratuita e titolo QR provengono dal server;
gli altri percorsi sono dichiarati non configurati finché il gestore non pubblica una regola.
La 0.20.0 ha aggiunto 679 attrazioni turistiche ricercabili e filtrabili. Dalla 0.35 la mappa mostra direttamente i singoli luoghi, senza una visualizzazione aggregata intermedia. Nomi, categorie, tag, coordinate e siti sono nel catalogo leggero; fotografie e siti
vengono caricati online e non entrano nell'APK. La 0.21.0 ha introdotto il nuovo marchio su launcher,
splash e intestazione, mantenendo `Sentieri` come nome principale e *d'Abruzzo* come declinazione
territoriale. La 0.22.0 crea l'edizione regionale definitiva `it.sentieri.abruzzo` e rimuove i dati
dimostrativi personali dalla nuova installazione. La 0.23.0 corregge e documenta le coordinate
delle attrazioni, rende coerenti le viste mappa ed elenco, usa checkbox nei filtri multipli e
semplifica per l'escursionista le informazioni tecniche sulle geometrie dei percorsi.
La 0.25.0 estende la base vettoriale e le curve TINITALY a tutto l’Abruzzo, introduce bivi di rete e codici sentiero meglio distribuiti, e usa la scala delle pendenze dal blu al rosso,
sincronizza correttamente il cursore planimetrico e altimetrico, irrobustisce la pulizia dei punti GPS
e completa modifica e cancellazione sincronizzata dei percorsi personali.
La 0.26.0 amplia le gallerie delle 679 attrazioni a 1.350 riferimenti fotografici remoti, mantenendo immagini e relativi file fuori dal database e dall’APK.

La 0.27.0 ripristina le quote e i dislivelli di tutti i 1.162 percorsi, adotta la geometria OpenStreetMap nei 130 confronti affidabili, costruisce le 28 aree come unioni di 305 comuni e corregge la decodifica delle mappe e delle curve di livello offline.
La 0.28.0 sostituisce la 0.27 perché corregge la sovrapposizione cartografica che poteva coprire l’Abruzzo con un riquadro azzurro e rende nuovamente visibili città, strade, parchi, corsi d’acqua e altri nomi geografici.
La 0.30.0 consolida la rete primaria OpenStreetMap: collega 977 percorsi agli archi OSM, rende espliciti 8.710 bivi e normalizza i tronconi fuori ordine senza creare raccordi tra componenti scollegati. Mappa, profilo, copertura e navigazione condividono ora la stessa struttura a segmenti.
La 0.32.0 ripristina la cartografia offline senza velature spurie, conserva laghi e altri elementi d’acqua reali e rigenera le curve di livello regionali con una semplificazione più delicata. Mantiene inoltre la copertura globale sui 1.163 sentieri e la gamification separata per parco o area di esplorazione.

ombreggiatura come livello autonomo e mantiene riprendibili le registrazioni finché non vengono salvate con un nome o eliminate.

La 0.45.0 conserva rete, profili, DEM e le 937 attrazioni Lazio qualificate da
fonti turistiche regionali, provinciali e comunali. Applica alla rete Lazio lo
standard OSM-first primario/secondario/terziario, ricuce soltanto le continuità
sicure, rende espliciti bivi e terminali terziari, separa le strade carrabili e
mantiene soltanto i secondari dotati di identità di catalogo. Le etichette
seguono la geometria dei percorsi, la rete usa tile vettoriali locali per
evitare esaurimenti di memoria durante lo zoom e i raster regionali obsoleti
non vengono più inclusi. OSM resta l’ossatura della rete e le
fotografie restano URL remoti fuori dall'APK.

Ogni edizione usa un APK completo con applicazione, mappe e dati territoriali
propri. Installato sopra una versione precedente della stessa edizione, conserva
tracce, profilo e dati personali; Abruzzo e Lazio possono convivere sul telefono.

1. Apri la pagina pubblica da Android.
2. Scegli Abruzzo o Lazio; se la stessa edizione è già installata, installa l’APK sopra la versione corrente senza disinstallare.
3. Se richiesto, consenti al browser di installare app dalla sorgente corrente.
4. Apri `Sentieri d’Abruzzo` e, in caso di migrazione, controlla subito lo Storico.

Scarica soltanto dalla pagina pubblica e confronta, se necessario, il file SHA-256 allegato alla release.

## Console gestore

La landing collega anche la console web gestore. Sono già disponibili:

- nome dell’app, ente, logo e palette configurabile;
- anteprima mobile e controllo del contrasto;
- centro e dimensioni dei pacchetti cartografici;
- catalogo regionale filtrabile e scheda del singolo percorso;
- creazione da GPX o GeoJSON con originale privato, geometria e validazione;
- calendario aggregato e gestione di capienze e prenotazioni per percorso;
- utenti, ruoli, Guardiaparco e audit delle operazioni amministrative.

La console richiede un account personale autorizzato con email e password. La
conferma email serve soltanto al primo accesso e il collegamento di recupero
soltanto quando richiesto. La sessione resta memorizzata nel dispositivo; una
perdita di rete non la cancella.

## Stato delle applicazioni

- app utente Android: build installabile con catalogo, mappe offline, profili e prima registrazione GPS sul campo;
- prototipo web utente: esplorativo, non pubblicato come servizio operativo;
- console web gestore: prototipo autenticato con catalogo, prenotazioni, ruoli e audit online;
- app Guardiaparco: prima beta Android separata con accesso di servizio, scansione QR, verifica server e cronologia dei controlli;
- portale verbali: modello definito, implementazione non iniziata.

## Avvertenza

Sentieri è un progetto sperimentale. Non è ancora un’app ufficiale del PNALM o di altri enti e non deve
essere usata per navigazione, sicurezza, prenotazioni reali, controllo degli accessi o accertamenti.
