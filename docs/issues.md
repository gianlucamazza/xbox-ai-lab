# Backlog operativo

Aggiornato il 7 novembre 2026. Nove issue GitHub aperte; nessun task completato in questo snapshot.

La [roadmap](roadmap.md) descrive stati e milestone. Il [piano esecutivo](execution-plan.md) riporta ordine, stime e responsabilità. Le checklist dettagliate restano nelle issue.

| Issue                                                       | Priorità / milestone | Stato                           | Prerequisiti                                            | Criterio di uscita                                 |
| ----------------------------------------------------------- | -------------------- | ------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| [#1](https://github.com/gianlucamazza/xbox-ai-lab/issues/1) | P0 / M1              | Pronto — CI in errore           | Nessuna                                                 | npm ci riproducibile sul runner                    |
| [#2](https://github.com/gianlucamazza/xbox-ai-lab/issues/2) | P0 / M1              | Bloccato                        | #1                                                      | Playwright/axe, revisione manuale e Lighthouse ≥95 |
| [#3](https://github.com/gianlucamazza/xbox-ai-lab/issues/3) | P0 / M2              | Avviabile con toolchain Windows | Nessun blocco iniziale; integrazione CI dopo #1         | Solution UWP x64 compilabile                       |
| [#4](https://github.com/gianlucamazza/xbox-ai-lab/issues/4) | P0 / M2              | Avviabile                       | Formato da concordare con #3                            | Validator evidenze e raw samples                   |
| [#5](https://github.com/gianlucamazza/xbox-ai-lab/issues/5) | P0 / M2              | Bloccato + hardware necessario  | #3, #4; PC Windows e console                            | Esecuzione fisica documentata, positiva o negativa |
| [#6](https://github.com/gianlucamazza/xbox-ai-lab/issues/6) | P1 / M2              | Bloccato + revisore necessario  | #4, #5                                                  | Replica indipendente e rapporto                    |
| [#7](https://github.com/gianlucamazza/xbox-ai-lab/issues/7) | P1 / M3              | Bloccato                        | #5 con baseline CPU anche negativa                      | GPU provata oppure blocco riproducibile            |
| [#8](https://github.com/gianlucamazza/xbox-ai-lab/issues/8) | P1 / M1              | Bloccato                        | #1, #2 e revisione contenuti                            | Preview privata dal commit verificato              |
| [#9](https://github.com/gianlucamazza/xbox-ai-lab/issues/9) | P2 / M4              | Differito                       | Runtime CPU o GPU verificato + budget memoria osservato | Decisione go/no-go prima di LLM e decode           |

La [CI verificata](https://github.com/gianlucamazza/xbox-ai-lab/actions/runs/42374743200) fallisce a npm ci; il job ONNX host passa. Priorità immediata #1; #3 e #4 sono avviabili separatamente. Non confondere stato operativo del task, presenza di codice e validazione hardware.
