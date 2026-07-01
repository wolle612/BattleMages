function toRoman(rank) {

    const numerals = [
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X"
    ];

    return numerals[rank] || rank;
}

function romanize(rank) {

    const numerals = [
        "",
        "I",
        "II",
        "III",
        "IV",
        "V"
    ];

    return numerals[rank];
}
