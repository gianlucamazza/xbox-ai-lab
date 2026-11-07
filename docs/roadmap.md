# Roadmap operativa — Xbox AI Lab

Snapshot verificato il 7 novembre 2026. Repository e preview restano privati. Stato delle attività distinto dai risultati tecnici: nessuna delle nove issue è dichiarata completata.

## Stato osservato

La [run 42374743200](https://github.com/gianlucamazza/xbox-ai-lab/actions/runs/42374743200), sul commit 1abb0a2dd6e12b7da1ad504199ca821a8b3a41d3, fallisce nel job web a npm ci. Il job model-reference passa. Playwright, axe e Lighthouse non partono in quella run. Le prove fisiche restano pending.

## Milestone e dipendenze

| Milestone | Obiettivo                 | Issue          | Completamento                                                                      |
| --------- | ------------------------- | -------------- | ---------------------------------------------------------------------------------- |
| M1        | Preview privata del sito  | #1, #2, #8     | CI e revisioni web passate; deploy e smoke test verificati                         |
| M2        | Esperimento riproducibile | #3, #4, #5, #6 | App compilabile, evidenze fisiche e revisione indipendente; esito anche negativo   |
| M3        | Decisione GPU             | #7             | Provider/adapter dimostrato oppure blocco documentato                              |
| M4        | Decisione transformer     | #9             | Runtime CPU o GPU verificato, budget memoria e operatori sufficienti; poi go/no-go |

## Task

| Issue                                                       | Priorità / milestone | Stato operativo                       | Prerequisiti                                            | Criterio di uscita                                 |
| ----------------------------------------------------------- | -------------------- | ------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| [#1](https://github.com/gianlucamazza/xbox-ai-lab/issues/1) | P0 / M1              | Pronto — CI in errore                 | Nessuna                                                 | npm ci riproducibile sul runner                    |
| [#2](https://github.com/gianlucamazza/xbox-ai-lab/issues/2) | P0 / M1              | Bloccato                              | #1                                                      | Playwright/axe, revisione manuale e Lighthouse ≥95 |
| [#3](https://github.com/gianlucamazza/xbox-ai-lab/issues/3) | P0 / M2              | Avviabile — integrazione Linux nativa | Nessun blocco iniziale; integrazione CI dopo #1         | App UWP C++/WinRT x64 cross-compilabile            |
| [#4](https://github.com/gianlucamazza/xbox-ai-lab/issues/4) | P0 / M2              | Avviabile                             | Formato da concordare con #3                            | Validator evidenze e raw samples                   |
| [#5](https://github.com/gianlucamazza/xbox-ai-lab/issues/5) | P0 / M2              | Bloccato + hardware necessario        | #3, #4; host Linux e console                            | Esecuzione fisica documentata, positiva o negativa |
| [#6](https://github.com/gianlucamazza/xbox-ai-lab/issues/6) | P1 / M2              | Bloccato + revisore necessario        | #4, #5                                                  | Replica indipendente e rapporto                    |
| [#7](https://github.com/gianlucamazza/xbox-ai-lab/issues/7) | P1 / M3              | Bloccato                              | #5 con baseline CPU anche negativa                      | GPU provata oppure blocco riproducibile            |
| [#8](https://github.com/gianlucamazza/xbox-ai-lab/issues/8) | P1 / M1              | Bloccato                              | #1, #2 e revisione contenuti                            | Preview privata dal commit verificato              |
| [#9](https://github.com/gianlucamazza/xbox-ai-lab/issues/9) | P2 / M4              | Differito                             | Runtime CPU o GPU verificato + budget memoria osservato | Decisione go/no-go prima di LLM e decode           |

## Lavoro avviabile

- #1: riparare l'installazione sul runner senza abbassare i gate.
- #3: predisporre e compilare il progetto da Linux; non serve ancora una console.
- #4: definire e verificare il formato delle evidenze; concordare l'export con #3.
- Dopo #1, eseguire #2; dopo i gate web, procedere con #8 anche se il test console resta pending.

## Dipendenze esterne

Le prove #5 richiedono un host Linux, una console e un operatore. Series S è il target iniziale preferito, non un requisito per documentare un'altra console disponibile. Series X mantiene stato separato. #6 richiede un revisore indipendente. Non sono dichiarate disponibilità hardware o assegnazioni a persone.

## Regole di avanzamento

- Nessuna chiusura issue o dichiarazione di successo senza gli artefatti previsti.
- La baseline CPU di #5 può essere negativa: ciò non impedisce di investigare un diverso percorso GPU ufficiale in #7.
- #9 richiede un runtime verificato, CPU oppure GPU; il successo DirectML non è un prerequisito presunto.
- Nessun grafico da dati sintetici, non verificati o host-only. Nessun TTFT/tokens/s per un grafo Add.
- Il completamento del sito non richiede un successo inferenza: richiede che gli stati pending siano espliciti.

## Allineamento dei contenuti

[src/roadmap.ts](../src/roadmap.ts) alimenta la route /roadmap senza chiamate GitHub dal browser. Questa pagina e le issue sono snapshot allineati durante la review; non un'integrazione automatica in tempo reale. Aggiornare nello stesso intervento stato, dipendenze e riferimenti quando nuove evidenze cambiano la pianificazione. Il [piano esecutivo](execution-plan.md) conserva stime e sequenza di lavoro.

## Correzione toolchain — 7 novembre 2026

Windows non è obbligatorio per build e deploy: riusare uwp-crossbuild per C++/WinRT e openappx per pack/sign/inspect/Device Portal. #3 comprende il port nativo di Probe.cs, UI in codice senza .xaml, pin delle revisioni e verifica SDK completa separata dalla CI leggera. #5 può essere eseguita da Linux; la console e la provenienza retail/managed restano da documentare. Le evidenze upstream non convalidano EXP-001. Vedere [ADR-002](ADR-002.md) e [review delle toolchain](linux-toolchain-review.md).
