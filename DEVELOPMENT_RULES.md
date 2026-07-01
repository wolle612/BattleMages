Battlemages - DEVELOPMENT_RULES

Zweck

Dieses Dokument definiert die verbindlichen Regeln für die Zusammenarbeit mit Cursor während der Entwicklung von Battlemages. Bei Widersprüchen gelten diese Regeln zusammen mit den Design-Dokumenten als verbindlich.

1. Single Source of Truth
•	Combat Design Document enthält alle Gameplay-, Kampf- und Balanceentscheidungen.
•	Game Design Document enthält Spielfluss, UI und Features.
•	Technical Design Document enthält Architektur und Projektstruktur.
•	Cursor darf diese Dokumente nicht eigenständig verändern oder interpretieren.
2. Arbeitsablauf
•	Vor jeder Aufgabe zuerst die relevanten Dokumente lesen.
•	Vor jeder Implementierung einen technischen Plan erstellen.
•	Geänderte Dateien vorab auflisten.
•	Erst nach Freigabe Code schreiben.
•	Nach Abschluss kurz erläutern, was umgesetzt wurde.
3. Designregeln
•	Keine neuen Gameplay-Mechaniken erfinden.
•	Keine Balancewerte eigenständig anpassen.
•	Keine zusätzlichen Ressourcen (Mana etc.) einführen.
•	Keine Features ergänzen, die nicht angefordert wurden.
•	Bei fehlenden Informationen Rückfragen stellen statt Annahmen treffen.
4. Code-Regeln
•	Kleine, klar getrennte Module.
•	Keine Magic Numbers – Werte aus Konfigurationsdateien laden.
•	Gameplay-Logik niemals im Renderer.
•	Keine doppelte Logik.
•	Saubere Benennung und gut lesbare Funktionen.
•	Refactorings nur mit Begründung.
5. Datengetriebenes Design
•	Zauber, Gegner, Upgrades und Schulen werden über JSON beschrieben.
•	Neue Inhalte sollen ohne Änderungen an der Combat Engine ergänzt werden können.
•	Hardcodierte Spielwerte vermeiden.
6. Entwicklungsreihenfolge
1. Projektstruktur
2. State-System
3. Combat Engine
4. Spell Engine
5. Enemy Engine
6. Reward System
7. Drag & Drop
8. UI
9. Animationen & Feedback
10. Balancing
11. Save/Load
12. Polish
7. Definition of Done
•	Code kompiliert bzw. läuft fehlerfrei.
•	Keine Konsolenfehler.
•	Bestehende Funktionen bleiben erhalten.
•	Architekturregeln wurden eingehalten.
•	Änderungen sind dokumentiert.
8. Was Cursor niemals tun darf
•	Dateien ohne Begründung löschen.
•	Projektstruktur eigenmächtig umbauen.
•	Gameplay vereinfachen oder erweitern.
•	Designentscheidungen überschreiben.
•	Mehrere große Systeme gleichzeitig implementieren.
9. Leitsatz
Battlemages wird iterativ entwickelt. Jede Sitzung implementiert genau ein klar abgegrenztes System. Stabilität, Nachvollziehbarkeit und Wartbarkeit haben Vorrang vor Geschwindigkeit.
