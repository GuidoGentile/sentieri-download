# Sentieri — download pubblico

Questo repository pubblico ospita la pagina di presentazione e le release dimostrative di Sentieri.

## Android

La release attuale è una **build sperimentale 0.13.0 ARM64 di aggiornamento**, distribuita fuori
dal Play Store per test controllati. L’APK contiene il catalogo PNALM offline con 155 candidati,
cartografia vettoriale offline, profili altimetrici e registrazione GPS predisposta per continuare
anche a schermo spento. Dal menu `Registra` si può creare un percorso personale privato e vederlo
crescere sulla mappa; al termine può essere completato con stelle, ricordo e fino a 5 foto private,
quindi salvato nello Storico o eliminato integralmente con
conferma. Il campionamento è configurabile tra 30 secondi, 1 minuto e 2 minuti. La quota
viene attribuita successivamente tramite DEM. I punti alimentano la copertura dei 131 percorsi
ufficiali PNALM, con percentuale, titoli progressivi e classifica dimostrativa. Il comportamento GPS
è stato provato sul campo in una prima registrazione reale. La 0.13.0 recupera registrazioni interrotte,
riunisce soltanto frammenti compatibili e scarta i salti GPS che implicherebbero più di 50 km/h. La copia
resta sul telefono; il collegamento Supabase è predisposto ma non ancora attivo in questo APK. La 0.13.0
riusa i dati cartografici della 0.12.0 completa: per una prima installazione occorre installare la
0.12.0 e aprire almeno una mappa, quindi applicare la 0.13.0 senza disinstallare l'app.

1. Apri la pagina pubblica da Android.
2. Tocca **Scarica Sentieri per Android**.
3. Se richiesto, consenti al browser di installare app dalla sorgente corrente.
4. Installa e apri `Sentieri`.

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

La demo non è autenticata e salva le modifiche soltanto nel browser. Editor GIS, import GPX/GeoJSON,
validazione amministrativa e sincronizzazione server sono ancora da realizzare.

## Stato delle applicazioni

- app utente Android: build installabile con catalogo, mappe offline, profili e prima registrazione GPS sul campo;
- prototipo web utente: esplorativo, non pubblicato come servizio operativo;
- console web gestore: demo pubblica con configurazione locale e governo iniziale delle tracce;
- app Guardia Parco: modello definito, implementazione non iniziata;
- portale verbali: modello definito, implementazione non iniziata.

## Avvertenza

Sentieri è un progetto sperimentale. Non è ancora un’app ufficiale del PNALM o di altri enti e non deve
essere usata per navigazione, sicurezza, prenotazioni reali, controllo degli accessi o accertamenti.
