function playVfxSound(soundKey) {
    if (!soundKey) {
        return;
    }

    // Kein Audiosystem im Projekt vorhanden (siehe Architekturplan, Phase 4).
    // Bewusster No-Op-Stub: die Timeline kann schon heute einen Sound-Schritt
    // einplanen, ohne dass die spätere Audio-Integration die Choreografie
    // der Cast-/Projectile-/Impact-Schritte nachträglich umbauen muss.
}
