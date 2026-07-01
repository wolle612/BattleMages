const spells = [
    {
        name: "Glutgeschoss",
        description: "Verursacht Schaden und setzt das Ziel in Brand.",
        element: "Feuer",
        damage: 5,
        cooldown: 1,
        starter: true
    },
    {
        name: "Frostbiss",
        description: "Verlangsamt Gegner und verursacht Frostschaden.",
        element: "Frost",
        damage: 4,
        cooldown: 1,
        starter: true
    },
    {
        name: "Runensplitter",
        description: "Verursacht Schaden und macht das Ziel brüchig.",
        element: "Arkan",
        damage: 4,
        cooldown: 2,
        starter: true
    },
    {
        name: "Glutpanzer",
        description: "Schützt dich und verbrennt Angreifer.",
        element: "Feuer",
        shield: 2,
        cooldown: 4,
        starter: true
    },
    {
        name: "Frostschild",
        description: "Gewährt Schutz und verlangsamt Angreifer.",
        element: "Frost",
        shield: 3,
        cooldown: 4,
        starter: true
    },
    {
        name: "Inferno",
        description: "Ein mächtiger Feuerzauber.",
        element: "Feuer",
        damage: 8,
        cooldown: 3,
        starter: false
    },
    {
        name: "Brennendes Blut",
        description: "Verstärkt Feuermagie.",
        element: "Feuer",
        cooldown: 4,
        starter: false,
        fireBuff: true
    },
    {
        name: "Lawine",
        description: "Ein starker Frostzauber.",
        element: "Frost",
        damage: 7,
        cooldown: 3,
        starter: false
    },
    {
        name: "Wintereinbruch",
        description: "Nutzt verlangsamte Gegner aus.",
        element: "Frost",
        damage: 8,
        cooldown: 4,
        starter: false
    },
    {
        name: "Äthersturm",
        description: "Ein mächtiger Arkanzauber.",
        element: "Arkan",
        damage: 7,
        cooldown: 3,
        starter: false
    },
    {
        name: "Zerfall",
        description: "Nutzt Brüchig aus.",
        element: "Arkan",
        damage: 8,
        cooldown: 4,
        starter: false
    },
    {
        name: "Arkaner Schleier",
        description: "Arkane Schutzmagie.",
        element: "Arkan",
        shield: 4,
        cooldown: 4,
        starter: false
    },
];
