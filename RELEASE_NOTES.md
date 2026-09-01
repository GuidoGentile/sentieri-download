# Note di versione

## 0.44.8 — 1 settembre 2026

- sostituisce il caricamento globale della rete sentieristica con tile
  vettoriali locali: primari, secondari e terziari restano integri, mentre il
  cambio di zoom non espande più in memoria il GeoJSON Lazio da 68,9 MB;
- rigenera le etichette Lazio dalla geometria finale della rete: 12.557
  scudetti compatti orientati e 128 nomi lineari seguono ora i percorsi come
  nell'edizione Abruzzo;
- elimina il vecchio raster nazionale sfocato e porta il rilievo regionale
  TINITALY sull'intero rettangolo massimo di Abruzzo e Lazio, comprese le tile
  marine;
- consegna il dettaglio alla carta vettoriale: il rilievo regionale raggiunge
  opacità zero a zoom 11,2 e l'hillshade raster a zoom 12;
- la build Lazio è stata installata in-place sul Samsung SM-S926B e ha
  attraversato ripetutamente gli zoom 7–14 con PID stabile e senza crash;
- Abruzzo e Lazio usano `versionCode 64` e `versionName 0.44.8`, application ID
  distinti e certificato invariato.

`02-Sentieri-Abruzzo-0.44.8-arm64.apk` misura 331.052.749 byte e ha SHA-256 `188d5a2e0e82e5d5d316ec0b729e0ffdf5dc16849a319037a80dac0ad72830df`.

`Sentieri-Lazio-0.44.8-arm64.apk` misura 307.710.742 byte e ha SHA-256 `670e04d74821f653eb5f3c151cef1465af9e4335e9b467dce09fa5b828ce15f7`.

## 0.44.7 — 31 agosto 2026

- introduce come standard regionale la rete OSM-first a tre livelli: primari
  associati a CAI o parchi, secondari identificabili con metadati rilevanti e
  terziari non elencati né etichettati ma visibili in primo piano per
  l’esplorazione;
- il Lazio pubblica 1.635 percorsi identificabili e 65.652 archi: 5.107
  primari, 2.431 secondari e 58.114 terziari; otto relazioni con identità OSM
  artificiale sono state tolte dal catalogo senza cancellarne automaticamente
  l’eventuale geometria utile;
- elimina dal contesto terziario 1.627 elementi non escursionistici o urbani,
  fra cui marciapiedi, attraversamenti e percorsi asfaltati o illuminati senza
  evidenza escursionistica;
- prolunga conservativamente i percorsi catalogati attraverso 2.602 nodi di
  continuità di grado due e ricuce 20 microinterruzioni fino a due metri, senza
  attraversare bivi, cambi di livello o identità diverse;
- pubblica 13.323 nodi primari/secondari e 4.913 nodi terziari; il livello
  terziario è disponibile dallo zoom 11 e resta sopra rilievo, vegetazione e
  altre basi cartografiche;
- identifica 9.275 parti di strada sterrata OSM come viabilità distinta. I
  7.152 archi terziari coincidenti non vengono duplicati come sentieri, mentre
  un percorso primario o secondario che segue una sterrata conserva entrambe
  le letture;
- aggiunge una procedura riproducibile e controlli bloccanti affinché lo stesso
  criterio sia applicato a ogni nuova edizione regionale;
- Abruzzo e Lazio usano `versionCode 63` e `versionName 0.44.7`.

`02-Sentieri-Abruzzo-0.44.7-arm64.apk` misura 325.948.056 byte e ha SHA-256 `8b5bbe5c0a91b395fd710f2dfc8ad18cec057ff31a04b7c4cbc1a051fb0b82d5`.

`Sentieri-Lazio-0.44.7-arm64.apk` misura 299.194.665 byte e ha SHA-256 `431ec378aeb138a6be165542e66ff0530cef12d9f4984daac788536c48fb9ea3`.

## 0.44.6 — 31 agosto 2026

- sostituisce i due segnaposto vuoti Lazio con nodi derivati dalla topologia
  dell’ossatura OSM già pubblicata, senza creare intersezioni artificiali;
- pubblica 13.435 nodi primari/secondari: 8.573 bivi, 4.416 terminali e 446
  cambi di livello; il contesto conserva inoltre 5.239 incroci terziari
  maggiori o nominati;
- rende i bivi primari e secondari visibili dallo zoom 11, i terminali dallo
  zoom 13 e i terziari dallo zoom 14, limitando l’affollamento regionale;
- aggiunge un audit riproducibile e blocca la distribuzione di una nuova
  edizione quando il file dei nodi principali manca o è vuoto;
- non cambia lo stato delle fonti: i nodi descrivono la topologia OSM, non
  attribuiscono ufficialità e non certificano la continuità turn-by-turn;
- Abruzzo e Lazio usano `versionCode 62` e `versionName 0.44.6`; la Lazio è
  stata aggiornata in-place, avviata sul telefono e verificata senza errori
  fatali di avvio.

`02-Sentieri-Abruzzo-0.44.6-arm64.apk` misura 325.947.928 byte e ha SHA-256 `a614f207393f57c15e3210b78061f990ea395d8e4fd3362c3894ce9517a09d9c`.

`Sentieri-Lazio-0.44.6-arm64.apk` misura 294.698.205 byte e ha SHA-256 `b8bca393d64f300a5a053a76baf661d43ce45dba2066b263527585df90c3a5c4`.

## 0.44.5 — 31 agosto 2026

- aggiunge ad Abruzzo e Lazio un livello fisico regionale offline z7–10,
  derivato dai rispettivi mosaici TINITALY 1.1 con tinte ipsometriche calde,
  rilievi rossicci e hillshade leggero;
- raccorda la panoramica nazionale Natural Earth al dettaglio OSM senza
  stirare il raster a bassa risoluzione: campiture territoriali più trasparenti
  alle scale intermedie e ritorno progressivo della base vettoriale entro z11,2;
- il nuovo archivio contiene 70 tile e circa 0,6 MiB in Abruzzo, 90 tile e circa
  0,7 MiB nel Lazio. Il gate di distribuzione blocca pacchetti mancanti, vuoti o
  oltre 10 MiB;
- Tracestrack Topo resta un riferimento visivo: nessuna tile ospitata viene
  copiata o scaricata in massa;
- Abruzzo e Lazio usano `versionCode 61` e `versionName 0.44.5`; la Lazio è
  stata installata in-place, avviata sul telefono e ha estratto correttamente il
  nuovo MBTiles nella memoria privata.

`02-Sentieri-Abruzzo-0.44.5-arm64.apk` misura 326.437.072 byte e ha SHA-256 `cb5cf1183035f64b6836c45d02275d2db4ef15eb5ccae7e1f937c5434ac258f9`.

`Sentieri-Lazio-0.44.5-arm64.apk` misura 293.604.189 byte e ha SHA-256 `32840293f3103c19319c6d7ba11f77cdbd4850b23677d6f0abb9978ee91673ca`.

## 0.44.4 — 31 agosto 2026

- Sentieri del Lazio passa da 617 candidati soltanto OSM a 937 attrazioni
  qualificate da portali turistici regionali, provinciali e comunali;
- le schede coprono 366 comuni. 680 attrazioni hanno almeno una fotografia
  remota collegata, per 697 riferimenti complessivi;
- OSM resta la fonte di identità candidata e coordinate; i nomi incerti o
  omonimi restano nello staging e non vengono pubblicati;
- fotografie, crediti e siti restano collegamenti alle pagine istituzionali:
  nessun file fotografico entra nell'APK o nel database;
- Abruzzo e Lazio usano `versionCode 60` e `versionName 0.44.4`, con
  application ID, dati e porte cartografiche distinti.

`02-Sentieri-Abruzzo-0.44.4-arm64.apk` misura 308.402.430 byte e ha SHA-256 `7f0468929da2b9b0c4e1b6a33560a966ca31324323e8de369dc9362f59a8f5ca`.

`Sentieri-Lazio-0.44.4-arm64.apk` misura 288.362.127 byte e ha SHA-256 `67c0f23894600081c21a1cfc05ce8a99e0b58192918cecb25b63b8a3728fde39`.

## 0.44.3 — 31 agosto 2026

- Sentieri del Lazio include il DEM regionale reale TINITALY 1.1: profili e
  dislivelli completi per 1.643 percorsi, curve ogni 10 metri con direttrici
  ogni 50 e hillshade offline;
- la selezione Lazio usa 22 riquadri sorgente a 10 metri. Nell’APK entrano solo
  i derivati compatti: 650 tile di curve e 977 tile di rilievo;
- il manifest verifica profili, metriche e contenuto effettivo degli MBTiles.
  Una nuova edizione regionale non può più essere distribuita con archivi DEM
  mancanti o segnaposto vuoti;
- Abruzzo e Lazio usano `versionCode 59` e `versionName 0.44.3`, con application
  ID e porte cartografiche locali distinti.

`02-Sentieri-Abruzzo-0.44.3-arm64.apk` misura 308.402.434 byte e ha SHA-256 `81106d9da827e32ec4e158d17055fed1c91aaf7399468878c2927f2fdd65c505`.

`Sentieri-Lazio-0.44.3-arm64.apk` misura 288.229.459 byte e ha SHA-256 `743adf942b12fa5f21e6c299e5fee9277e9a3c03e77c8cb99f3a91f9e796ac12`.

## 0.44.2 — 31 agosto 2026

- aggiunge ad Abruzzo e Lazio una panoramica fisica offline dell’Italia, ispirata alla leggibilità di Tracestrack Topo ma generata da Natural Earth II 3.2.0, pubblico dominio;
- limita la carta nazionale agli zoom 4–8 e la dissolve entro lo zoom 9, dove continua la cartografia vettoriale OSM delle singole edizioni;
- distribuisce soltanto 207 tile JPEG in un MBTiles da 1.212.416 byte, sotto il limite bloccante di 5 MiB;
- non copia le tile ospitate da Tracestrack: i loro termini vietano il download massivo senza accordo;
- assegna porte locali distinte ad Abruzzo e Lazio, così le mappe offline funzionano anche quando entrambe le app restano attive sullo stesso telefono;
- usa `versionCode 58` e `versionName 0.44.2` per entrambi gli application ID.

`02-Sentieri-Abruzzo-0.44.2-arm64.apk` misura 308.402.434 byte e ha SHA-256 `a0c6054c9d0e21f8bd9c304a0023e039c5a1b7aa2831046542d66809d36a88b0`.

`Sentieri-Lazio-0.44.2-arm64.apk` misura 195.511.467 byte e ha SHA-256 `54b7c15f8cb291f7a5f15cd5de42f170aca94bf46801057ea77b7c145db4daf8`.

## 0.44.1 Lazio — 31 agosto 2026

- aggiunge il contesto marino regionale mancante, con Tirreno e porzione di Adriatico visibile nella panoramica;
- deriva la costa e le isole dai confini regionali ISTAT 2026, CC BY 4.0, senza riattivare i poligoni ocean OSM che in passato potevano coprire l’entroterra;
- verifica geometricamente che il mare al largo di Ostia sia incluso e che Roma, lago di Bolsena e Ponza restino terra;
- è stata installata e avviata su telefono Android, verificando visivamente Tirreno, costa e isole nella panoramica;
- mantiene invariati ossatura OSM, 1.643 identità di percorso, 617 attrazioni e separazione completa dai dati Abruzzo;
- usa `it.sentieri.lazio`, `versionCode 57` e `versionName 0.44.1`.

Il file `Sentieri-Lazio-0.44.1-arm64.apk` misura 194.510.780 byte e ha SHA-256 `0ffc01e8c635f104a6d3ba1b6b6be228dada330f6c48ba4407d031a94e9a6ee0`.

## 0.44.0 — 31 agosto 2026

### Sentieri del Lazio — build candidata

- aggiunge l’edizione separata `it.sentieri.lazio`, installabile insieme a Sentieri d’Abruzzo;
- include 1.643 identità di percorso, 617 attrazioni e il pacchetto vettoriale offline Lazio;
- costruisce il grafo fisico sui way OpenStreetMap e conserva separatamente le evidenze CAI e ParchiLazio usate per qualificare e promuovere le identità;
- usa il marchio a foglia inclinata con profilo ispirato al Terminillo e cielo coerente con l’icona Abruzzo;
- è stata installata e avviata su un telefono Android, ma non è ancora validata sul campo e non offre navigazione certificata.

Il file `Sentieri-Lazio-0.44-arm64.apk` misura 194.430.464 byte e ha SHA-256 `c0d062b98e711587e24db21d9a5018321a72522492e8a0c4144c50203f90b123`.

### Sentieri d’Abruzzo

- preserva integralmente geometrie, nodi ed etichette della rete primaria e secondaria pubblicata nella 0.43;
- aggiunge la rete terziaria OSM come sorgente vettoriale autonoma, beige e marrone tratteggiata, senza creare elementi nel catalogo;
- aggiunge nodi terziari distinti soltanto nello zoom ravvicinato e mantiene la precedenza dei nodi primari e secondari;
- mostra i nomi OSM lungo le vie nello zoom di dettaglio e aggiunge offline 144 impianti sciistici e 176 stazioni;
- anticipa la visibilità della rete primaria e secondaria nella panoramica regionale, ingrandisce i parcheggi e rende più chiara l’indicazione del Nord.

La 0.44.0 usa `it.sentieri.abruzzo`, `versionCode 56` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.44-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.43.0 — 30 agosto 2026

- la rete OSM resta l’ossatura topologica e CAI-INFOMONT diventa una regola nazionale per promuovere nella rete primaria le identità CAI documentate;
- nodi finali, terminali secondari, targhette e verso delle etichette sono più coerenti; le etichette restano leggibili anche ruotando la mappa;
- punti d’acqua, laghi e corsi d’acqua sono più evidenti e conservano il contorno blu nelle continuità idrografiche;
- ricerca di Percorsi e Attrazioni allineata, Copertura visibile a ogni scala e intestazioni fisse in Account, Impostazioni, Storico e percorsi personali;
- Account e Impostazioni sono pagine distinte; la rotazione automatica dello schermo è disattivata inizialmente e la scelta viene ricordata;
- il dettaglio delle tracce personali mostra la data completa accanto a Modifica ed Elimina, dispone le sei metriche su tre righe e nasconde le diciture tecniche di recupero dopo il salvataggio.

La 0.43.0 usa `it.sentieri.abruzzo`, `versionCode 55` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.43-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.42.0 — 30 agosto 2026

- la planimetria colorata usa soltanto una geometria di rete completa, con controlli di connessione, copertura, estremi e rapporto di lunghezza prima di sostituire la traccia canonica;
- preservati anche i brevissimi archi OSM che costituiscono un collegamento topologico reale, come il raccordo tra C3 e C5, senza introdurre falsi nodi visibili;
- le linee della rete primaria e secondaria compaiono dallo zoom 9,5; nodi e targhette restano rispettivamente agli zoom 11 e 12 per mantenere pulita la vista territoriale;
- logo, ricerca e bordi esterni delle card principali condividono una guida unica a 16 dp;
- profilo altimetrico e planimetria restano sincronizzati e ricadono sulla geometria canonica quando l’associazione OSM è parziale o distorta;
- etichette dei sentieri più leggibili, rettangolari e scalate gradualmente con lo zoom.

La 0.42.0 usa `it.sentieri.abruzzo`, `versionCode 54` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.42-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.41.0 — 28 agosto 2026

- ogni percorso principale o secondario con identità propria è ora una sola sequenza continua e non ramificata;
- monconi, tratti paralleli e deviazioni restano visibili come rete subordinata, associata al percorso padre ma senza etichetta, scheda, recensione o prenotazione autonoma;
- le etichette dei percorsi in mappa sono selezionabili anche per cambiare direttamente il percorso corrente;
- la rete pubblicata contiene 9.941 archi e 4.580 nodi; l’audit verifica tutti i 1.162 percorsi e non rileva errori o avvisi;
- logo e campo di ricerca della home Percorsi condividono ora lo stesso allineamento sinistro;
- versione e build dei sorgenti iOS sono riallineate alla candidata Android; compilazione, firma e distribuzione TestFlight restano separate e richiedono Xcode su Mac.

La 0.41.0 usa `it.sentieri.abruzzo`, `versionCode 53` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.41-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.40.0 — 28 agosto 2026

- OpenStreetMap diventa l’ossatura geometrica e topologica della rete escursionistica, senza importare indiscriminatamente gli altri elementi OSM;
- parchi e CAI alimentano prioritariamente denominazione, codice, difficoltà, stato e qualificazione ufficiale, mantenendo separati geometria e autorità della fonte;
- gli itinerari ufficiali dei parchi e quelli CAI formano la rete primaria; gli altri sentieri, collegamenti e deviazioni costituiscono la rete secondaria;
- 1.128 percorsi su 1.163 trovano una presenza OSM significativa; soltanto 35 usano una geometria esterna perché realmente assenti dall’ossatura OSM;
- la rete pubblicata contiene 10.058 archi e 4.810 nodi; gli originali e la precedente rete versione 1 rimangono conservati per audit e confronti;
- backup di profilo e tracce personali, predisposizione iOS e documentazione tecnica sono riallineati alla stessa versione candidata.

La 0.40.0 usa `it.sentieri.abruzzo`, `versionCode 52` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.40-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.


## 0.39.0 — 25 agosto 2026

- aggiunto il Mare Adriatico come livello offline dedicato, sotto la carta fisica e senza riaprire i poligoni oceanici che coprivano l'entroterra;
- autostrade e superstrade sono distinte dalla viabilità ordinaria con toni marroni leggibili sulla carta;
- il selettore Lista/Mappa è allineato al menu globale e le ricerche di Percorsi e Attrazioni mostrano soltanto `Cerca`;
- planimetria colorata, profilo altimetrico e cursore usano una sola progressiva monotona, evitando salti tra rami paralleli, tornanti o estremi degli anelli;
- gli archi memorizzati al contrario vengono orientati senza alterare il verso dell'escursione; se l'allineamento non è affidabile resta visibile la geometria tridimensionale del catalogo;
- mantenuti rete gerarchica, nodi secondari e terminali, idrografia continua, mappe e curve offline complete della 0.38 candidata.

La 0.39.0 usa `it.sentieri.abruzzo`, `versionCode 49` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.39-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.38.0 — 25 agosto 2026

- laghi, bacini e pozze non marini hanno un layer lineare blu autonomo, più leggibile del solo bordo del riempimento su MapLibre Android;
- tutti i corsi d’acqua ricevono un contorno blu sottile; fiumi, canali e corsi nominati mantengono un secondo contorno più marcato;
- l’ordine di disegno collega visivamente immissari ed emissari alla sponda dei laghi senza interruzioni;
- la regola è identica nei livelli regionali e di dettaglio, nord e sud, ed è protetta da un test automatico;
- le biforcazioni dei rami secondari mantengono il simbolo ambra anche quando toccano la rete primaria e compaiono dallo stesso livello di zoom dei sentieri secondari;
- i nodi finali vengono agganciati alla geometria pubblicata dello stesso percorso, eliminando terminali isolati; tutti i nodi sono visibili dallo zoom della rete.

La 0.38.0 usa `it.sentieri.abruzzo`, `versionCode 48` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.38-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.37.0 — 25 agosto 2026

- la rete sentieristica pubblicata è ora un grafo gerarchico continuo: rete primaria ufficiale/CAI, rete secondaria e vie OpenStreetMap non associate hanno identità e rappresentazioni distinte;
- nodi primari, nodi secondari, estremità e varianti sono verificati; frammenti isolati o dubbi restano in quarantena fuori dall’APK invece di apparire come percorsi spezzati;
- cartografia offline rifinita con acque continue e più leggibili, etichette sopra la carta fisica, priorità alle cime, confine regionale permanente, aree opzionali e POI per parcheggi e punti d’acqua;
- Percorsi si apre in vista Mappa; ricerca, filtri e selettore lista/mappa condividono lo stesso catalogo e le targhette dei percorsi restano il riferimento di selezione;
- due registrazioni personali salvate vengono mostrate come un’unica escursione quando nome, mezzo, giornata, distanza e intervallo indicano con prudenza la stessa uscita; punti ed esagoni originali restano intatti nel database;
- il consolidamento delle tracce personali viene ripetuto all’avvio e dopo il ripristino Supabase, senza cancellazioni automatiche remote.

La 0.37.0 usa `it.sentieri.abruzzo`, `versionCode 47` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.37-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.36.0 — 25 agosto 2026

- Percorsi e Attrazioni collocano il selettore lista/mappa accanto ai filtri e conservano la modalità scelta durante la navigazione;
- la home Percorsi elimina il titolo ripetuto e mostra il conteggio soltanto quando ricerca o filtri restringono il catalogo;
- lista e mappa consumano lo stesso insieme filtrato: con criteri attivi la carta mostra esclusivamente i risultati, senza lasciare visibili elementi esclusi;
- nella mappa Percorsi è possibile aprire la stessa scheda della lista toccando direttamente la linea o il relativo riferimento;
- nelle testate interne il logo sostituisce la freccia grafica e il ritorno resta affidato al comando Indietro di Android.

La 0.36.0 usa `it.sentieri.abruzzo`, `versionCode 46` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.36-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.35.0 — 25 agosto 2026

- la mappa Attrazioni elimina la visualizzazione aggregata: i 679 luoghi georeferenziati sono mostrati direttamente come punti cliccabili e ricerca e filtri aggiornano lo stesso insieme visibile della lista;
- tornando dal dettaglio di un’attrazione, la mappa conserva il luogo attivo e lo inquadra allo zoom locale;
- nella mappa Attrazioni il livello Sentieri parte disattivato e il pannello dei layer si chiude toccando la carta;
- i confini delle aree di lavoro scompaiono allo zoom ravvicinato, mentre confine regionale e aree protette restano layer indipendenti;
- aggiunti test automatici per la selezione dei punti georeferenziati, il comportamento dei controlli e la soglia di zoom dei confini.

La 0.35.0 usa `it.sentieri.abruzzo`, `versionCode 45` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.35-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.34.0 — 25 agosto 2026

- completata la gerarchia della rete sentieristica con nodi reali ai bivi e nodi terminali anche alla fine dei percorsi;
- i tratti primari ufficiali o CAI prevalgono sui secondari quasi sovrapposti, mentre le diramazioni secondarie conservano un proprio nodo e restano riconoscibili;
- accorciata la cadenza dei tratti di sentieri e strade sterrate, aumentato lo spessore della rete secondaria e raddoppiata la leggibilità dei corsi d’acqua;
- le etichette delle cime danno priorità alla quota maggiore quando lo spazio non consente di mostrarle tutte;
- aggiunto alla mappa un livello offline autonomo “Aree protette”, distinto dalle aree turistiche, con PNALM, Maiella, Gran Sasso e Monti della Laga e Sirente-Velino;
- mantenute separate geometria operativa di rete, ufficialità, identità CAI, fonti e osservazioni originali, così il gestore potrà riesaminare le associazioni senza perdere informazioni.

La 0.34.0 usa `it.sentieri.abruzzo`, `versionCode 44` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.34-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.33.0 — 24 agosto 2026

- introdotta una gerarchia cartografica stabile: rete primaria ufficiale/CAI, rete secondaria dei percorsi pubblicati e contesto OSM non catalogato;
- consolidate le geometrie OpenStreetMap più affidabili in archi e bivi reali, mantenendo separate ufficialità, fonti, validazione e osservazioni originali;
- allineati tracciato planimetrico colorato, profilo altimetrico e cursore alla stessa geometria operativa di rete;
- resi costanti con lo zoom spessore e cadenza dei sentieri, con codici orientati sugli archi e simboli triangolari nuovamente visibili per le cime;
- rigenerate le curve regionali TINITALY con lisciatura metrica controllata, passo 10 metri e direttrici ogni 50 metri;
- aggiunta l’ombreggiatura del rilievo come livello offline autonomo, attivabile o disattivabile anche durante navigazione e registrazione;
- eliminato il popup dei bivi: i nodi restano leggibili sulla carta senza interrompere l’esplorazione;
- una registrazione non salvata resta riprendibile dopo uscita dalla pagina, arresto del servizio o riapertura dell’app; si conclude soltanto salvandola con un nome o eliminandola esplicitamente;
- alleggerita la linguetta altimetrica chiusa eliminando l’icona decorativa laterale.

La 0.33.0 usa `it.sentieri.abruzzo`, `versionCode 43` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.33-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.32.0 — 23 agosto 2026

- eliminata la velatura azzurra rettangolare che copriva l’Abruzzo, causata da poligoni oceanici errati presenti nelle tile vettoriali interne;
- laghi e altri elementi d’acqua reali restano visibili, mentre i poligoni `ocean` spuri vengono esclusi da tutti i livelli regionali e di dettaglio;
- rimosso il precedente riempimento semitrasparente applicato sopra il territorio regionale;
- rigenerate le curve di livello regionali con una semplificazione molto più delicata, per ottenere linee più morbide e fedeli soprattutto agli zoom intermedi;
- incrementata la versione del pacchetto cartografico incorporato, così l’aggiornamento sostituisce automaticamente i vecchi dati offline.

La 0.32.0 usa `it.sentieri.abruzzo`, `versionCode 42` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.32-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.31.0 — 23 agosto 2026

- la mappa Copertura considera gli esagoni validi di tutti i 1.163 sentieri installati e mantiene visibile l’intero territorio;
- percentuale, titolo, prossimo traguardo e classifica sono separati per tre parchi nazionali, il Parco Regionale Sirente-Velino e cinque aree di esplorazione;
- la card bianca della Copertura si trascina verso l’alto e permette di cambiare ambito senza ricaricare la mappa;
- Account → Impostazioni conserva il parco o l’area scelta e la sezione Informazioni rimanda alla guida completa aggiornata;
- un controllo automatico assegna ogni percorso a un solo ambito statistico e impedisce ambiti vuoti o sovrapposti nella configurazione.

La 0.31.0 usa `it.sentieri.abruzzo`, `versionCode 41` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.31-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.30.0 rete continua e controllo esteso — 23 agosto 2026

- la rete OpenStreetMap resta il modello cartografico predominante: 73.287 archi locali, 8.710 bivi reali e 977 dei 1.163 percorsi collegati alla rete;
- 876 percorsi usano una geometria OSM operativa verificata contro l'osservazione sorgente normalizzata, mentre ufficialità, codice, fonte e geometrie originali restano distinti e conservati;
- i tronconi fuori ordine vengono ricomposti entro una tolleranza di 35 metri, i punti consecutivi duplicati sono eliminati e i componenti davvero scollegati restano separati;
- mappa, profilo altimetrico, copertura, quota offline e controllo fuori-traccia rispettano i segmenti reali e non creano raccordi artificiali;
- una verifica estesa e ripetibile controlla catalogo, asset Android, rete, bivi, quote 3D, associazioni OSM e la regressione del percorso PNALM A1: 0 errori e 0 avvisi.

La 0.30.0 usa `it.sentieri.abruzzo`, `versionCode 40` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.30-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.29.0 rete sentieristica OSM e correzioni di campo — 23 agosto 2026

- la rete OpenStreetMap diventa la geometria sentieristica primaria sulla mappa: 73.287 elementi di rete locali, tratto rosso-bianco più leggibile e 8.708 bivi rilevanti derivati dai nodi reali;
- 975 dei 1.162 percorsi del catalogo sono associati con soglia prudenziale agli archi OSM; ufficialità, provenienza e geometria originale restano separate e conservate, mentre gli archi OSM non associati sono visibili solo in mappa e non diventano percorsi ricercabili o recensibili;
- i percorsi senza una corrispondenza OSM affidabile continuano a usare la geometria del catalogo, evitando fusioni arbitrarie;
- la base vettoriale centrale e meridionale torna leggibile su tutto l’Abruzzo; curve, cime, valichi e nomi geografici restano distinti, con quote delle curve intermedie visibili allo zoom ravvicinato;
- test bloccanti verificano che tutti i 1.162 percorsi conservino coordinate tridimensionali, salita e discesa prima della pubblicazione;
- Attrazioni e Copertura dispongono degli stessi comandi cliccabili per layer, nord e posizione; lista e mappa mantengono il margine sotto la ricerca e il conteggio filtrato non espone il nome tecnico dell’area;
- la data di nascita gestisce la digitazione continua con separatori automatici e cursore coerente;
- le tracce personali usano lo stesso profilo altimetrico completo dei percorsi ufficiali; all’avvio vengono ripulite retroattivamente da punti GPS impossibili, soste agli estremi e code in automobile, ricostruendo distanza ed esagoni.

La 0.29.0 usa `it.sentieri.abruzzo`, `versionCode 39` e lo stesso certificato stabile delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.29-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.28.0 correzione della base cartografica — 23 agosto 2026

- rimosso il riempimento acqua del secondo estratto OpenStreetMap che nella 0.27 poteva apparire come un grande riquadro azzurro sopra l’Abruzzo;
- mantenuti entrambi gli estratti offline per estendere strade, suolo e riferimenti territoriali, evitando però che il livello acqua sovrapposto copra la base principale;
- città, paesi, strade, parchi, corsi d’acqua, cime e altri luoghi leggono anche il campo `name:latin` realmente presente nelle tile e tornano visibili;
- aggiornata la chiave della cache cartografica affinché lo stile corretto sia ricaricato dopo l’installazione;
- verificata la resa senza rete nella mappa generale, nella mappa dinamica del percorso, in Attrazioni e in Copertura.

La 0.28.0 sostituisce la 0.27.0, usa `it.sentieri.abruzzo`, `versionCode 38` e lo stesso certificato delle release precedenti. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.28-arm64.apk`; va installato sopra la versione corrente senza disinstallare, così Android conserva tracce, profilo e dati personali.

## 0.27.0 cartografia e geometrie regionali — 22 agosto 2026

> Superata dalla 0.28.0: su alcuni dispositivi la composizione dei due estratti OSM mostrava un grande riquadro azzurro e le etichette geografiche restavano assenti.

- tutti i 1.162 percorsi conservano nuovamente quote TINITALY, dislivelli e profilo altimetrico completo nell’APK;
- 130 percorsi adottano la geometria OpenStreetMap quando coincide in modo affidabile con la fonte autorevole ed è più precisa; l’originale ufficiale resta conservato per verifica;
- la rete cartografica contiene 1.230 bivi e 8.889 cartellini orientati lungo i tratti, mantenendo identificabili i codici CAI;
- le 28 aree territoriali non sono più celle geometriche: derivano dall’assegnazione esplicita dei 305 comuni abruzzesi e rispettano i confini comunali ISTAT;
- il lettore Android riconosce e decomprime correttamente le tile vettoriali e le curve di livello GZIP anche in assenza del metadato dell’archivio;
- la cache cartografica precedente viene invalidata, evitando sfondi vuoti o livelli che scompaiono passando agli zoom di dettaglio;
- le immagini di Abruzzo Turismo vengono richieste in una forma HTTPS ridimensionata e compatibile, senza archiviarle nel database o nell’APK.

La 0.27.0 usa `it.sentieri.abruzzo`, `versionCode 37` e lo stesso certificato della 0.26. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.27-arm64.apk`; installandolo sopra la versione corrente Android conserva tracce, profilo e dati personali.

## 0.26.0 gallerie delle attrazioni — 21 agosto 2026

- il catalogo conserva 679 attrazioni e passa da 973 a 1.350 riferimenti fotografici remoti;
- 481 attrazioni dispongono ora di almeno due immagini, senza riempire le lacune con stemmi, mappe amministrative o immagini generiche;
- Abruzzo Turismo resta la fonte principale e Wikimedia Commons integra le gallerie conservando pagina sorgente, autore e licenza;
- le immagini restano esterne all’app e richiedono connessione: non entrano nel database, nell’APK o nei pacchetti territoriali;
- cache, segnaposto, riprova manuale e rispetto delle attese richieste dalla fonte rendono più robusto il caricamento.

La 0.26.0 usa `it.sentieri.abruzzo`, `versionCode 36` e lo stesso certificato della 0.25. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.26-arm64.apk`.

## 0.25.0 rete e cartografia regionale — 21 agosto 2026

- un unico APK completo sostituisce definitivamente il vecchio flusso con build ponte; l’installazione sopra la 0.24 conserva database, tracce e dati personali;
- la base vettoriale offline copre un contesto di 280 km e un dettaglio di 180 km centrati sull’Abruzzo, senza fasce vuote a nord o a sud e senza sparizioni passando agli zoom superiori;
- tutte le dodici tile DEM TINITALY disponibili generano curve ogni 10 m e direttrici ogni 50 m; allo zoom ravvicinato ogni curva può mostrare la quota;
- il catalogo diventa una rete: 1.256 bivi reali sono riconosciuti dalle geometrie e mostrano i codici dei percorsi collegati;
- 8.905 cartellini sentiero sono distribuiti sui tratti tra i bivi; il tratteggio rosso e bianco usa segmenti più lunghi e leggibili;
- l’identità ufficiale resta separata dalla geometria: 28 tracciati ufficiali adottano OpenStreetMap soltanto quando la coincidenza è forte e il rilievo è sensibilmente più preciso, conservando sempre l’originale per il gestore;
- il confine dell’Abruzzo e le 28 aree operative sono livelli autonomi; la mappa generale mantiene costa, Roma e Tavoliere come riferimenti di contesto;
- le testate con azione a destra centrano il titolo nello spazio tra i comandi; il controllo informativo MapLibre non occupa più la mappa.

La 0.25.0 usa `it.sentieri.abruzzo`, `versionCode 35` e lo stesso certificato della 0.24. Il solo file da scaricare è `02-Sentieri-Abruzzo-0.25-arm64.apk`.

## 0.24.0 affidabilità sul campo — 21 agosto 2026

- le mappe aumentano la leggibilità di etichette, cime, curve di livello e rete dei sentieri; bussola, freccia e scala chilometrica seguono correttamente orientamento e zoom;
- mappa e profilo altimetrico usano la stessa posizione lungo il percorso e una scala assoluta a sei fasce: blu 0–5%, celeste 5–10%, verde 10–15%, giallo 15–20%, arancio 20–25%, rosso oltre il 25%;
- la registrazione scarta punti con precisione insufficiente, salti oltre 50 km/h e brevi escursioni GPS impossibili, mantenendo recuperabili le sessioni interrotte;
- i percorsi personali possono sempre cambiare nome, giudizio, ricordo e fotografie oppure essere eliminati integralmente; una cancellazione offline resta in attesa e viene applicata anche alla copia Supabase;
- il catalogo pubblico consolida ulteriori fasce duplicate e contiene 1.163 card canoniche, 339 identità CAI e profili altimetrici completi, senza perdere osservazioni e varianti destinate al gestore;
- Attrazioni mantiene la stessa pagina tra lista e mappa, mostra il conteggio come informazione secondaria, semplifica i filtri per area e dispone di 973 riferimenti fotografici remoti senza incorporare immagini nell’APK;
- la galleria delle attrazioni elimina l’etichetta ridondante `Online`.

La 0.24.0 usa `it.sentieri.abruzzo`, `versionCode 34` e lo stesso certificato della 0.23. Può quindi
essere installata sopra Sentieri d’Abruzzo senza disinstallare l’app e senza perdere database, tracce o dati offline.

## 0.23.0 qualità dei cataloghi — 20 agosto 2026

- la sezione Attrazioni mantiene la stessa vista passando da mappa a elenco e mostra sempre quanti luoghi risultano visibili sul totale;
- categorie, aree e tag sono filtri multipli riconoscibili tramite checkbox; le card restano pulite e mostrano tutti i tag soltanto nel dettaglio;
- le coordinate delle attrazioni sono confrontate con i confini comunali ISTAT 2026, conservando posizione originale, motivazione e provenienza delle correzioni;
- i casi geografici estesi, costieri o dubbi restano in code di revisione distinte e non vengono corretti alla cieca;
- il catalogo dei percorsi conserva varianti e confronti geometrici per il gestore, ma non mostra all'escursionista diciture tecniche come `geometria concorde`;
- undici doppioni geometrici forti vengono assorbiti nel relativo percorso canonico: il catalogo pubblico passa da 1.219 a 1.208 card senza perdere fonti e osservazioni;
- la console gestore consolida accesso con email e password, sessione persistente, catalogo multi-ente, calendario, prenotazioni, ruoli e audit.

La 0.23.0 mantiene application ID e certificato della 0.22. Installarla sopra Sentieri d'Abruzzo
senza disinstallare l'app conserva tracce, database e dati territoriali già presenti sul telefono.

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
