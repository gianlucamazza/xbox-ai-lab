# Backlog operativo

Aggiornato il 7 novembre 2026. Le specifiche sono ora tracciate in issue GitHub nel repository privato.

Il [piano esecutivo](execution-plan.md) definisce ordine, dipendenze, stime e milestone. I criteri di accettazione dettagliati sono nelle singole issue.

| Priorità | Issue                                                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | [#1 — [P0] Ripristinare npm ci e rendere riproducibile la toolchain CI](https://github.com/gianlucamazza/xbox-ai-lab/issues/1)               |
| P0       | [#2 — [P0] Completare Playwright, accessibilità e Lighthouse su CI](https://github.com/gianlucamazza/xbox-ai-lab/issues/2)                   |
| P0       | [#3 — [P0] Trasformare Probe.cs in un progetto UWP minimo compilabile](https://github.com/gianlucamazza/xbox-ai-lab/issues/3)                |
| P0       | [#4 — [P0] Rendere verificabile il bundle di evidenze e l'importazione dei risultati](https://github.com/gianlucamazza/xbox-ai-lab/issues/4) |
| P0       | [#5 — [P0] Eseguire EXP-001 su console reale, partendo da Series S](https://github.com/gianlucamazza/xbox-ai-lab/issues/5)                   |
| P1       | [#6 — [P1] Replicare EXP-001 e pubblicare il primo rapporto sperimentale](https://github.com/gianlucamazza/xbox-ai-lab/issues/6)             |
| P1       | [#7 — [P1] Investigare API e packaging GPU con esiti supportati da evidenze](https://github.com/gianlucamazza/xbox-ai-lab/issues/7)          |
| P1       | [#8 — [P1] Preparare e distribuire una preview privata dopo i gate web](https://github.com/gianlucamazza/xbox-ai-lab/issues/8)               |
| P2       | [#9 — [P2] Valutare transformer quantizzati e decode solo dopo un runtime verificato](https://github.com/gianlucamazza/xbox-ai-lab/issues/9) |

Priorità immediata: #1. La prima CI fallisce in npm ci; il job ONNX host passa. #3 e #4 possono iniziare indipendentemente. Le prove fisiche #5 richiedono hardware e un operatore. Nessun task è completato solo perché esiste la relativa issue.
