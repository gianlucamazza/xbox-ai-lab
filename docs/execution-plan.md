# Xbox AI Lab — Piano esecutivo

Aggiornato: 7 novembre 2026. Repository privato. Le issue pianificano lavoro futuro; non dimostrano esecuzione o compatibilità hardware.

Per lo stato operativo aggiornato e i collegamenti alle issue vedere la [roadmap](roadmap.md).

## Baseline verificata

Snapshot del codice: 1abb0a2dd6e12b7da1ad504199ca821a8b3a41d3. Anche la [run 42374743200](https://github.com/gianlucamazza/xbox-ai-lab/actions/runs/42374743200) fallisce nel job web a npm ci. La prima run 42374106825 segnalava EUSAGE con dipendenze mancanti nel lockfile; la causa di fondo resta da investigare. Il job model-reference passa in entrambe le run. I controlli browser non sono stati eseguiti. Nessun task è completato e non è stata acquisita evidenza console.

## Ordine di esecuzione

Stime in giornate di lavoro, non scadenze o garanzie di successo sperimentale. I ruoli indicano responsabilità, senza assegnazioni a persone o agenti già avviati.

| Fase | Issue                                                                            | Ruolo                                | Dipendenze                                      | Stima                          | Criterio di uscita                                                   |
| ---- | -------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| 1    | [#1 Toolchain e lockfile](https://github.com/gianlucamazza/xbox-ai-lab/issues/1) | Engineering / release                | Nessuna                                         | 0,5–1 g                        | npm ci riproducibile e controlli base verdi sul runner               |
| 2A   | [#2 Qualità web](https://github.com/gianlucamazza/xbox-ai-lab/issues/2)          | QA / frontend                        | #1                                              | 1–2 g + fix                    | Playwright/axe, revisione manuale, link e Lighthouse >=95 con report |
| 2B   | [#3 Progetto UWP](https://github.com/gianlucamazza/xbox-ai-lab/issues/3)         | Linux / native UWP engineering       | Avvio indipendente; CI dopo #1                  | 1–2 g                          | App C++/WinRT x64 cross-compilabile e packaging openappx documentato |
| 2C   | [#4 Validator evidenze](https://github.com/gianlucamazza/xbox-ai-lab/issues/4)   | Research engineering                 | Avvio indipendente; formato concordato con #3   | 1–2 g                          | Hash, file, metadati, raw samples e stati controllati                |
| 3A   | [#8 Preview privata](https://github.com/gianlucamazza/xbox-ai-lab/issues/8)      | Release / QA                         | #1, #2 e revisione contenuti                    | 0,5–1 g                        | Deploy privato dal commit verificato; pending hardware visibile      |
| 3B   | [#5 EXP-001 console](https://github.com/gianlucamazza/xbox-ai-lab/issues/5)      | Operatore hardware                   | #3, #4, host Linux e console disponibili        | 0,5–1 g per modello            | Bundle di successo o fallimento riproducibile                        |
| 4A   | [#6 Replica e rapporto](https://github.com/gianlucamazza/xbox-ai-lab/issues/6)   | Revisore indipendente                | #4, #5                                          | 1–2 g + disponibilità revisore | Risultato indipendente; grafici solo da misure valide                |
| 4B   | [#7 Indagine GPU](https://github.com/gianlucamazza/xbox-ai-lab/issues/7)         | GPU / Linux / native UWP engineering | Deployment e baseline CPU di #5, anche negativa | Spike 2–3 g                    | Provider/adapter provato oppure blocco documentato                   |
| 5    | [#9 Transformer e decode](https://github.com/gianlucamazza/xbox-ai-lab/issues/9) | Inference engineering                | Runtime verificato e budget memoria osservato   | Spike 2 g; poi ristima         | Go/no-go su operatori, correttezza e memoria prima del LLM           |

## Prima iterazione

1. Chiudere #1 senza aggirare npm ci o abbassare i gate.
2. Avviare #3 e #4 come filoni indipendenti, senza attendere una console.
3. Eseguire #2 sul runner e conservare report verificabili.
4. Preparare #8 quando i gate web passano. Il sito può essere una research preview con console pending.
5. Eseguire #5 quando un operatore dispone di host Linux e hardware. Series S è il target iniziale preferito; usare il modello disponibile e mantenere gli altri pending.

## Milestone

- **M1: Website release candidate.** #1, #2 e #8 completate; navigazione e download verificati in produzione privata.
- **M2: Esperimento riproducibile.** #3, #4, #5 e #6 completate con un esito documentato. Un fallimento riproducibile è un risultato, non una prova di inferenza supportata.
- **M3: Decisione GPU.** #7 produce un percorso ufficiale verificato o un ADR di blocco/alternativa.
- **M4: Decisione transformer.** #9 parte con un runtime effettivo e un budget memoria sufficiente. CPU e GPU sono alternative da valutare; DirectML non è un requisito presunto.

## Gate e limiti

- Nessun deploy prima del completamento dei gate web richiesti.
- Compilazione Windows e test host non convalidano Xbox.
- Misure accompagnate da ambiente, hash, source revision, correttezza e raw samples per processo.
- Cold/warm separati; nessun TTFT/tokens/s per il modello Add.
- Richiedere una GPU non prova di averla usata; fallback CPU e provider ignoto non validano GPU.
- Il risultato su una console non convalida l'altra. La review indipendente resta un gate distinto dalla validazione schema.
- Nessuna scadenza per il successo WinML/GPU/LLM; prevedere esiti unsupported e failure.
- Repository e preview restano privati; cambio audience e pubblicazione pubblica fuori da questo piano.

## Correzione toolchain — 7 novembre 2026

Windows non è obbligatorio per build e deploy: riusare uwp-crossbuild per C++/WinRT e openappx per pack/sign/inspect/Device Portal. #3 comprende il port nativo di Probe.cs, UI in codice senza .xaml, pin delle revisioni e verifica SDK completa separata dalla CI leggera. #5 può essere eseguita da Linux; la console e la provenienza retail/managed restano da documentare. Le evidenze upstream non convalidano EXP-001. Vedere [ADR-002](ADR-002.md) e [review delle toolchain](linux-toolchain-review.md).
