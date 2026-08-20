# Sentieri — download pubblico

Questo repository pubblico ospita la pagina di presentazione e le release dimostrative di Sentieri.

La sezione [`guida/`](guida/) contiene il manuale d'uso e la descrizione tecnica approfondita della
piattaforma. È pensata per gli utenti dell'app, per la presentazione a enti e potenziali clienti e come
base descrittiva dell'opera software, mantenendo distinti componenti realizzati, dimostrativi e pianificati.

## Android

La release attuale è una **build sperimentale 0.21.0 ARM64**, distribuita fuori
dal Play Store per test controllati. L’APK contiene un catalogo offline di 1.219 percorsi
canonici abruzzesi, con 334 identità CAI documentate e fonti storiche conservate,
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
si possono rinominare e consultare con la stessa sequenza panoramica, mappa dinamica e profilo. La mappa
offre inoltre ripristino del nord, centratura della posizione e livelli separati per cime e valichi.
Sul percorso pilota A1 anche calendario, capienza, prenotazione gratuita e titolo QR provengono dal server;
gli altri percorsi sono dichiarati non configurati finché il gestore non pubblica una regola.
La 0.20.0 ha aggiunto 679 attrazioni turistiche ricercabili e filtrabili, organizzate in 28 aree
cartografiche. Nomi, categorie, tag, coordinate e siti sono nel catalogo leggero; fotografie e siti
vengono caricati online e non entrano nell'APK. La 0.21.0 introduce il nuovo marchio su launcher,
splash e intestazione, mantenendo `Sentieri` come nome principale e *d'Abruzzo* come declinazione
territoriale. Sono disponibili un aggiornamento leggero da installare senza disinstallare l'app e un APK completo
con tutti i dati cartografici per la prima installazione.

Il recupero della 0.21 usa l'identità anonima già conservata dalla versione installata. Per mantenere
i dati aggiornare senza disinstallare. Il collegamento Google, necessario per ritrovare lo stesso
account anche su un telefono nuovo, è il passo successivo e non è ancora operativo.

1. Apri la pagina pubblica da Android.
2. Tocca **Scarica Sentieri d’Abruzzo**.
3. Se richiesto, consenti al browser di installare app dalla sorgente corrente.
4. Installa e apri `Sentieri d’Abruzzo`.

Scarica soltanto dalla pagina pubblica e confronta, se necessario, il file SHA-256 allegato alla release.

## Console gestore

La landing collega anche una demo web della console gestore. Sono già esplorabili:

- nome dell’app, ente, logo e palette configurabile;
- anteprima mobile e controllo del contrasto;
- centro e dimensioni dei pacchetti cartografici;
- elenco dei percorsi presenti nell'app, con aggiunta, correzione ed esclusione locale;
- calendario delle disponibilità, capienze giornaliere, prenotazioni e posti liberi;
- coda di confronto tra sentieri coincidenti, varianti e casi da verificare;
- importazione ed esportazione locale della configurazione.

Senza accesso la console salva le modifiche dimostrative soltanto nel browser. Con l'account
autorizzato usa Supabase per catalogo regionale multi-ente, calendari, capienze, prenotazioni,
abilitazione delle Guardie e registro dei controlli. Editor GIS e import GPX/GeoJSON restano da collegare.

## Stato delle applicazioni

- app utente Android: build installabile con catalogo, mappe offline, profili e prima registrazione GPS sul campo;
- prototipo web utente: esplorativo, non pubblicato come servizio operativo;
- console web gestore: demo pubblica con configurazione locale e governo iniziale delle tracce;
- app Guardiaparco: prima beta Android separata con accesso di servizio, scansione QR, verifica server e cronologia dei controlli;
- portale verbali: modello definito, implementazione non iniziata.

## Avvertenza

Sentieri è un progetto sperimentale. Non è ancora un’app ufficiale del PNALM o di altri enti e non deve
essere usata per navigazione, sicurezza, prenotazioni reali, controllo degli accessi o accertamenti.
