# BattleMages -- VFX Animation Mapping v1.0

> Stand 2026-07-29: um die 21 zuvor fehlenden Zauber ergänzt (6 aus
> `spellbookCore.js`/`spellbookPart2.js`, 15 aus den neuen
> `spellbookPart3.js`/`spellbookPart4.js`) -- macht 56 Zauber gesamt.
> Verbindliche Quelle bleibt `SPELL_PROJECTILE_TYPES`
> (`data/vfx/spellVfxDefinitions.js`), diese Tabelle ist eine
> Lesehilfe, keine zweite Wahrheit.

## Prinzip

Jeder Zauber besteht aus genau drei wiederverwendbaren Bausteinen:

**Cast → Projektiltyp → Schul-Impact**

### Casts

-   Biomantie-Cast
-   Schatten-Cast
-   Psionik-Cast
-   Runenkunst-Cast
-   Chaos-Cast
-   Seelen-Cast

### Projektiltypen

-   **Beam** -- Strahlen, Energie- oder Seelenverbindungen
-   **Schnitt** -- Hiebe, Klingen, Stöße, Schläge und Nahkampfangriffe
-   **Projektil** -- Klassische fliegende Geschosse
-   **Explosion** -- Direkte Wirkungen ohne Flugbahn
-   **Schild** -- Defensiver Effekt am Spieler

### Impact

Jeder Zauber endet mit dem Impact seiner Schule: - Biomantie-Impact -
Schatten-Impact - Psionik-Impact - Runenkunst-Impact - Chaos-Impact -
Seelen-Impact

------------------------------------------------------------------------

  Zauber               Cast              Projektil   Impact
  -------------------- ----------------- ----------- -------------------
  Knochenbruch         Biomantie-Cast    Explosion   Biomantie-Impact
  Präzisionsschlag     Schatten-Cast     Schnitt     Schatten-Impact
  Schildwall           Runenkunst-Cast   Schild      Runenkunst-Impact
  Schildbrecher        Runenkunst-Cast   Schnitt     Runenkunst-Impact
  Dunkle Klinge        Schatten-Cast     Schnitt     Schatten-Impact
  Schattengriff        Schatten-Cast     Explosion   Schatten-Impact
  Todesstoß            Schatten-Cast     Schnitt     Schatten-Impact
  Organversagen        Biomantie-Cast    Projektil   Biomantie-Impact
  Runenharmonie        Runenkunst-Cast   Beam        Runenkunst-Impact
  Schattentanz         Schatten-Cast     Schnitt     Schatten-Impact
  Arkane Verkettung    Psionik-Cast      Beam        Psionik-Impact
  Reinheit             Runenkunst-Cast   Explosion   Runenkunst-Impact
  Blutgerinnsel        Biomantie-Cast    Explosion   Biomantie-Impact
  Willensbruch         Psionik-Cast      Projektil   Psionik-Impact
  Gedankenschlag       Psionik-Cast      Schnitt     Psionik-Impact
  Gedankenstrom        Psionik-Cast      Beam        Psionik-Impact
  Gedankenbarriere     Psionik-Cast      Schild      Psionik-Impact
  Verbotenes Siegel    Runenkunst-Cast   Schild      Runenkunst-Impact
  Verstärktes Siegel   Runenkunst-Cast   Schild      Runenkunst-Impact
  Schattenschritt      Schatten-Cast     Explosion   Schatten-Impact
  Bruchrune            Runenkunst-Cast   Projektil   Runenkunst-Impact
  Seelenbindung        Seelen-Cast       Beam        Seelen-Impact
  Seelenschnitt        Seelen-Cast       Schnitt     Seelen-Impact
  Chaoseruption        Chaos-Cast        Explosion   Chaos-Impact
  Anatomie             Biomantie-Cast    Projektil   Biomantie-Impact
  Knochenpanzer        Biomantie-Cast    Schild      Biomantie-Impact
  Schattenmantel       Schatten-Cast     Schild      Schatten-Impact
  Finsterer Hieb       Schatten-Cast     Schnitt     Schatten-Impact
  Gedankenfalle        Psionik-Cast      Explosion   Psionik-Impact
  Gedankenumlenkung    Psionik-Cast      Beam        Psionik-Impact
  Runenbruch           Runenkunst-Cast   Projektil   Runenkunst-Impact
  Runenstoß            Runenkunst-Cast   Schnitt     Runenkunst-Impact
  Chaosklinge          Chaos-Cast        Schnitt     Chaos-Impact
  Chaoskatalysator     Chaos-Cast        Projektil   Chaos-Impact
  Seelenimpuls         Seelen-Cast       Beam        Seelen-Impact
  Seelenfunke          Seelen-Cast       Projektil   Seelen-Impact
  Findiger Schnitt     Schatten-Cast     Schnitt     Schatten-Impact
  Entropie             Chaos-Cast        Explosion   Chaos-Impact
  Überladung           Chaos-Cast        Explosion   Chaos-Impact
  Gezügeltes Chaos     Chaos-Cast        Explosion   Chaos-Impact
  Seelenwache          Seelen-Cast       Beam        Seelen-Impact
  Seelenresonanz       Seelen-Cast       Beam        Seelen-Impact
  Seelenwanderung      Seelen-Cast       Beam        Seelen-Impact
  Wundbrand            Biomantie-Cast    Explosion   Biomantie-Impact
  Nervenschnitt        Biomantie-Cast    Schnitt     Biomantie-Impact
  Chaosentladung       Chaos-Cast        Explosion   Chaos-Impact
  Schattenpanzer       Schatten-Cast     Schnitt     Schatten-Impact
  Runenbindung         Runenkunst-Cast   Schild      Runenkunst-Impact
  Gedankenkaskade      Psionik-Cast      Beam        Psionik-Impact
  Gedämpfte Eruption   Chaos-Cast        Explosion   Chaos-Impact
  Seelenverschmelzung  Seelen-Cast       Beam        Seelen-Impact
  Organkollaps         Biomantie-Cast    Explosion   Biomantie-Impact
  Hinrichtung          Schatten-Cast     Schnitt     Schatten-Impact
  Geistessturm         Psionik-Cast      Beam        Psionik-Impact
  Runenkollaps         Runenkunst-Cast   Explosion   Runenkunst-Impact
  Vernichtung          Chaos-Cast        Explosion   Chaos-Impact
  Seelenapotheose      Seelen-Cast       Beam        Seelen-Impact
