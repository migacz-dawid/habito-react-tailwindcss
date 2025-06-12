const mockGoals = [
  {
    "id": "demo-1",
    "title": "Dieta",
    "description": "Codziennie wypijam 2 litry wody i jem porcję warzyw – bez wymówek!",
    "category": "health",
    "frequency": [
      "daily"
    ],
    "createdAt": "2025-03-27T00:00:00",
    "completedTask": false,
    "streakCount": 10,
    "isArchived": false,
    "relativeHistory": [
      {
        "offset": -60,
        "streakAtThatDay": 1
      },
      {
        "offset": -59,
        "streakAtThatDay": 2
      },
      {
        "offset": -58,
        "streakAtThatDay": 3
      },
      {
        "offset": -57,
        "streakAtThatDay": 4
      },
      {
        "offset": -56,
        "streakAtThatDay": 5
      },
      {
        "offset": -55,
        "streakAtThatDay": 6
      },
      {
        "offset": -54,
        "streakAtThatDay": 7
      },
      {
        "offset": -53,
        "streakAtThatDay": 8
      },
      {
        "offset": -52,
        "streakAtThatDay": 9
      },
      {
        "offset": -51,
        "streakAtThatDay": 10
      },
      {
        "offset": -50,
        "streakAtThatDay": 11
      },
      {
        "offset": -49,
        "streakAtThatDay": 12
      },
      {
        "offset": -48,
        "streakAtThatDay": 13
      },
      {
        "offset": -47,
        "streakAtThatDay": 0
      },
      {
        "offset": -46,
        "streakAtThatDay": -1
      },
      {
        "offset": -45,
        "streakAtThatDay": -2
      },
      {
        "offset": -44,
        "streakAtThatDay": -3
      },
      {
        "offset": -43,
        "streakAtThatDay": 1
      },
      {
        "offset": -42,
        "streakAtThatDay": 2
      },
      {
        "offset": -41,
        "streakAtThatDay": 3
      },
      {
        "offset": -40,
        "streakAtThatDay": 4
      },
      {
        "offset": -39,
        "streakAtThatDay": 5
      },
      {
        "offset": -38,
        "streakAtThatDay": 6
      },
      {
        "offset": -37,
        "streakAtThatDay": 7
      },
      {
        "offset": -36,
        "streakAtThatDay": 8
      },
      {
        "offset": -35,
        "streakAtThatDay": 9
      },
      {
        "offset": -34,
        "streakAtThatDay": 10
      },
      {
        "offset": -33,
        "streakAtThatDay": 11
      },
      {
        "offset": -32,
        "streakAtThatDay": 12
      },
      {
        "offset": -31,
        "streakAtThatDay": 13
      },
      {
        "offset": -30,
        "streakAtThatDay": 14
      },
      {
        "offset": -29,
        "streakAtThatDay": 15
      },
      {
        "offset": -28,
        "streakAtThatDay": 16
      },
      {
        "offset": -27,
        "streakAtThatDay": 17
      },
      {
        "offset": -26,
        "streakAtThatDay": 18
      },
      {
        "offset": -25,
        "streakAtThatDay": 19
      },
      {
        "offset": -24,
        "streakAtThatDay": 20
      },
      {
        "offset": -23,
        "streakAtThatDay": 21
      },
      {
        "offset": -22,
        "streakAtThatDay": 22
      },
      {
        "offset": -21,
        "streakAtThatDay": 23
      },
      {
        "offset": -20,
        "streakAtThatDay": 24
      },
      {
        "offset": -19,
        "streakAtThatDay": 25
      },
      {
        "offset": -18,
        "streakAtThatDay": 26
      },
      {
        "offset": -17,
        "streakAtThatDay": 27
      },
      {
        "offset": -16,
        "streakAtThatDay": 28
      },
      {
        "offset": -15,
        "streakAtThatDay": 29
      },
      {
        "offset": -14,
        "streakAtThatDay": 30
      },
      {
        "offset": -13,
        "streakAtThatDay": 0
      },
      {
        "offset": -12,
        "streakAtThatDay": -1
      },
      {
        "offset": -11,
        "streakAtThatDay": -2
      },
      {
        "offset": -10,
        "streakAtThatDay": 1
      },
      {
        "offset": -9,
        "streakAtThatDay": 2
      },
      {
        "offset": -8,
        "streakAtThatDay": 3
      },
      {
        "offset": -7,
        "streakAtThatDay": 4
      },
      {
        "offset": -6,
        "streakAtThatDay": 5
      },
      {
        "offset": -5,
        "streakAtThatDay": 6
      },
      {
        "offset": -4,
        "streakAtThatDay": 7
      },
      {
        "offset": -3,
        "streakAtThatDay": 8
      },
      {
        "offset": -2,
        "streakAtThatDay": 9
      },
      {
        "offset": -1,
        "streakAtThatDay": 10
      }
    ]
  },
  {
    "id": "demo-2",
    "title": "Siłownia",
    "description": "Trening siłowy 3x w tygodniu: klatka + ręce (pon.), plecy + barki (śr.), nogi (pt.)",
    "category": "health",
    "frequency": [
      "monday",
      "wednesday",
      "friday"
    ],
    "createdAt": "2025-03-27T00:00:00",
    "completedTask": false,
    "streakCount": 7,
    "isArchived": false,
    "relativeHistory": [
      {
        "offset": -59,
        "streakAtThatDay": 1
      },
      {
        "offset": -57,
        "streakAtThatDay": 2
      },
      {
        "offset": -55,
        "streakAtThatDay": 3
      },
      {
        "offset": -52,
        "streakAtThatDay": 4
      },
      {
        "offset": -50,
        "streakAtThatDay": 5
      },
      {
        "offset": -48,
        "streakAtThatDay": 6
      },
      {
        "offset": -45,
        "streakAtThatDay": 7
      },
      {
        "offset": -43,
        "streakAtThatDay": 0
      },
      {
        "offset": -41,
        "streakAtThatDay": -1
      },
      {
        "offset": -38,
        "streakAtThatDay": 1
      },
      {
        "offset": -36,
        "streakAtThatDay": 0
      },
      {
        "offset": -34,
        "streakAtThatDay": -1
      },
      {
        "offset": -31,
        "streakAtThatDay": 1
      },
      {
        "offset": -29,
        "streakAtThatDay": 2
      },
      {
        "offset": -27,
        "streakAtThatDay": 3
      },
      {
        "offset": -24,
        "streakAtThatDay": 4
      },
      {
        "offset": -22,
        "streakAtThatDay": 5
      },
      {
        "offset": -20,
        "streakAtThatDay": 6
      },
      {
        "offset": -17,
        "streakAtThatDay": 0
      },
      {
        "offset": -15,
        "streakAtThatDay": 1
      },
      {
        "offset": -13,
        "streakAtThatDay": 2
      },
      {
        "offset": -10,
        "streakAtThatDay": 3
      },
      {
        "offset": -8,
        "streakAtThatDay": 4
      },
      {
        "offset": -6,
        "streakAtThatDay": 5
      },
      {
        "offset": -3,
        "streakAtThatDay": 6
      },
      {
        "offset": -1,
        "streakAtThatDay": 7
      }
    ]
  },
  {
    "id": "demo-3",
    "title": "Nauka angielskiego",
    "description": "Codziennie 1 godzina nauki języka angielskiego – konsekwentny rozwój kompetencji językowych",
    "category": "personal",
    "frequency": [
      "monday",
      "tuesday",
      "thursday",
      "friday"
    ],
    "createdAt": "2025-03-27T00:00:00",
    "completedTask": false,
    "streakCount": 3,
    "isArchived": false,
    "relativeHistory": [
      {
        "offset": -59,
        "streakAtThatDay": 1
      },
      {
        "offset": -58,
        "streakAtThatDay": 2
      },
      {
        "offset": -56,
        "streakAtThatDay": 3
      },
      {
        "offset": -55,
        "streakAtThatDay": 4
      },
      {
        "offset": -52,
        "streakAtThatDay": 5
      },
      {
        "offset": -51,
        "streakAtThatDay": 6
      },
      {
        "offset": -49,
        "streakAtThatDay": 7
      },
      {
        "offset": -48,
        "streakAtThatDay": 8
      },
      {
        "offset": -45,
        "streakAtThatDay": 9
      },
      {
        "offset": -44,
        "streakAtThatDay": 10
      },
      {
        "offset": -42,
        "streakAtThatDay": 11
      },
      {
        "offset": -41,
        "streakAtThatDay": 0
      },
      {
        "offset": -38,
        "streakAtThatDay": -1
      },
      {
        "offset": -37,
        "streakAtThatDay": 1
      },
      {
        "offset": -35,
        "streakAtThatDay": 2
      },
      {
        "offset": -34,
        "streakAtThatDay": 3
      },
      {
        "offset": -31,
        "streakAtThatDay": 4
      },
      {
        "offset": -30,
        "streakAtThatDay": 5
      },
      {
        "offset": -28,
        "streakAtThatDay": 6
      },
      {
        "offset": -27,
        "streakAtThatDay": 7
      },
      {
        "offset": -24,
        "streakAtThatDay": 8
      },
      {
        "offset": -23,
        "streakAtThatDay": 9
      },
      {
        "offset": -21,
        "streakAtThatDay": 10
      },
      {
        "offset": -20,
        "streakAtThatDay": 11
      },
      {
        "offset": -17,
        "streakAtThatDay": 12
      },
      {
        "offset": -16,
        "streakAtThatDay": 13
      },
      {
        "offset": -14,
        "streakAtThatDay": 14
      },
      {
        "offset": -13,
        "streakAtThatDay": 15
      },
      {
        "offset": -10,
        "streakAtThatDay": 0
      },
      {
        "offset": -9,
        "streakAtThatDay": -1
      },
      {
        "offset": -7,
        "streakAtThatDay": -2
      },
      {
        "offset": -6,
        "streakAtThatDay": 1
      },
      {
        "offset": -3,
        "streakAtThatDay": 2
      },
      {
        "offset": -2,
        "streakAtThatDay": 3
      }
    ]
  },
  {
    "id": "demo-4",
    "title": "Nauka frontendu",
    "description": "30 minut dziennie z Reactem i TypeScriptem – rozwijam swoje umiejętności programistyczne",
    "category": "work",
    "frequency": [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday"
    ],
    "createdAt": "2025-03-27T00:00:00",
    "completedTask": false,
    "streakCount": 18,
    "isArchived": false,
    "relativeHistory": [
      {
        "offset": -59,
        "streakAtThatDay": 1
      },
      {
        "offset": -58,
        "streakAtThatDay": 2
      },
      {
        "offset": -57,
        "streakAtThatDay": 3
      },
      {
        "offset": -56,
        "streakAtThatDay": 4
      },
      {
        "offset": -55,
        "streakAtThatDay": 5
      },
      {
        "offset": -52,
        "streakAtThatDay": 6
      },
      {
        "offset": -51,
        "streakAtThatDay": 7
      },
      {
        "offset": -50,
        "streakAtThatDay": 0
      },
      {
        "offset": -49,
        "streakAtThatDay": -1
      },
      {
        "offset": -48,
        "streakAtThatDay": 1
      },
      {
        "offset": -45,
        "streakAtThatDay": 2
      },
      {
        "offset": -44,
        "streakAtThatDay": 3
      },
      {
        "offset": -43,
        "streakAtThatDay": 4
      },
      {
        "offset": -42,
        "streakAtThatDay": 5
      },
      {
        "offset": -41,
        "streakAtThatDay": 6
      },
      {
        "offset": -38,
        "streakAtThatDay": 7
      },
      {
        "offset": -37,
        "streakAtThatDay": 8
      },
      {
        "offset": -36,
        "streakAtThatDay": 9
      },
      {
        "offset": -35,
        "streakAtThatDay": 10
      },
      {
        "offset": -34,
        "streakAtThatDay": 11
      },
      {
        "offset": -31,
        "streakAtThatDay": 12
      },
      {
        "offset": -30,
        "streakAtThatDay": 13
      },
      {
        "offset": -29,
        "streakAtThatDay": 0
      },
      {
        "offset": -28,
        "streakAtThatDay": -1
      },
      {
        "offset": -27,
        "streakAtThatDay": -2
      },
      {
        "offset": -24,
        "streakAtThatDay": 1
      },
      {
        "offset": -23,
        "streakAtThatDay": 2
      },
      {
        "offset": -22,
        "streakAtThatDay": 3
      },
      {
        "offset": -21,
        "streakAtThatDay": 4
      },
      {
        "offset": -20,
        "streakAtThatDay": 5
      },
      {
        "offset": -17,
        "streakAtThatDay": 6
      },
      {
        "offset": -16,
        "streakAtThatDay": 7
      },
      {
        "offset": -15,
        "streakAtThatDay": 8
      },
      {
        "offset": -14,
        "streakAtThatDay": 9
      },
      {
        "offset": -13,
        "streakAtThatDay": 10
      },
      {
        "offset": -10,
        "streakAtThatDay": 11
      },
      {
        "offset": -9,
        "streakAtThatDay": 12
      },
      {
        "offset": -8,
        "streakAtThatDay": 13
      },
      {
        "offset": -7,
        "streakAtThatDay": 14
      },
      {
        "offset": -6,
        "streakAtThatDay": 15
      },
      {
        "offset": -3,
        "streakAtThatDay": 16
      },
      {
        "offset": -2,
        "streakAtThatDay": 17
      },
      {
        "offset": -1,
        "streakAtThatDay": 18
      }
    ]
  },
  {
    "id": "demo-5",
    "title": "Czytanie książki",
    "description": "30 minut dziennie z książką rozwojową ( o produktywności, psychologii, technologii)",
    "category": "personal",
    "frequency": [
      "daily"
    ],
    "createdAt": "2025-03-27T00:00:00",
    "completedTask": false,
    "streakCount": 8,
    "isArchived": false,
    "relativeHistory": [
      {
        "offset": -60,
        "streakAtThatDay": 1
      },
      {
        "offset": -59,
        "streakAtThatDay": 2
      },
      {
        "offset": -58,
        "streakAtThatDay": 3
      },
      {
        "offset": -57,
        "streakAtThatDay": 4
      },
      {
        "offset": -56,
        "streakAtThatDay": 5
      },
      {
        "offset": -55,
        "streakAtThatDay": 6
      },
      {
        "offset": -54,
        "streakAtThatDay": 7
      },
      {
        "offset": -53,
        "streakAtThatDay": 8
      },
      {
        "offset": -52,
        "streakAtThatDay": 9
      },
      {
        "offset": -51,
        "streakAtThatDay": 10
      },
      {
        "offset": -50,
        "streakAtThatDay": 11
      },
      {
        "offset": -49,
        "streakAtThatDay": 12
      },
      {
        "offset": -48,
        "streakAtThatDay": 13
      },
      {
        "offset": -47,
        "streakAtThatDay": 14
      },
      {
        "offset": -46,
        "streakAtThatDay": 15
      },
      {
        "offset": -45,
        "streakAtThatDay": 0
      },
      {
        "offset": -44,
        "streakAtThatDay": -1
      },
      {
        "offset": -43,
        "streakAtThatDay": -2
      },
      {
        "offset": -42,
        "streakAtThatDay": -3
      },
      {
        "offset": -41,
        "streakAtThatDay": 1
      },
      {
        "offset": -40,
        "streakAtThatDay": 2
      },
      {
        "offset": -39,
        "streakAtThatDay": 3
      },
      {
        "offset": -38,
        "streakAtThatDay": 4
      },
      {
        "offset": -37,
        "streakAtThatDay": 5
      },
      {
        "offset": -36,
        "streakAtThatDay": 6
      },
      {
        "offset": -35,
        "streakAtThatDay": 7
      },
      {
        "offset": -34,
        "streakAtThatDay": 8
      },
      {
        "offset": -33,
        "streakAtThatDay": 9
      },
      {
        "offset": -32,
        "streakAtThatDay": 10
      },
      {
        "offset": -31,
        "streakAtThatDay": 11
      },
      {
        "offset": -30,
        "streakAtThatDay": 12
      },
      {
        "offset": -29,
        "streakAtThatDay": 13
      },
      {
        "offset": -28,
        "streakAtThatDay": 14
      },
      {
        "offset": -27,
        "streakAtThatDay": 15
      },
      {
        "offset": -26,
        "streakAtThatDay": 16
      },
      {
        "offset": -25,
        "streakAtThatDay": 17
      },
      {
        "offset": -24,
        "streakAtThatDay": 18
      },
      {
        "offset": -23,
        "streakAtThatDay": 19
      },
      {
        "offset": -22,
        "streakAtThatDay": 20
      },
      {
        "offset": -21,
        "streakAtThatDay": 21
      },
      {
        "offset": -20,
        "streakAtThatDay": 22
      },
      {
        "offset": -19,
        "streakAtThatDay": 23
      },
      {
        "offset": -18,
        "streakAtThatDay": 24
      },
      {
        "offset": -17,
        "streakAtThatDay": 25
      },
      {
        "offset": -16,
        "streakAtThatDay": 26
      },
      {
        "offset": -15,
        "streakAtThatDay": 27
      },
      {
        "offset": -14,
        "streakAtThatDay": 28
      },
      {
        "offset": -13,
        "streakAtThatDay": 29
      },
      {
        "offset": -12,
        "streakAtThatDay": 30
      },
      {
        "offset": -11,
        "streakAtThatDay": 0
      },
      {
        "offset": -10,
        "streakAtThatDay": -1
      },
      {
        "offset": -9,
        "streakAtThatDay": -2
      },
      {
        "offset": -8,
        "streakAtThatDay": 1
      },
      {
        "offset": -7,
        "streakAtThatDay": 2
      },
      {
        "offset": -6,
        "streakAtThatDay": 3
      },
      {
        "offset": -5,
        "streakAtThatDay": 4
      },
      {
        "offset": -4,
        "streakAtThatDay": 5
      },
      {
        "offset": -3,
        "streakAtThatDay": 6
      },
      {
        "offset": -2,
        "streakAtThatDay": 7
      },
      {
        "offset": -1,
        "streakAtThatDay": 8
      }
    ]
  },
  {
    "id": "demo-6",
    "title": "Znajdowanie nowych klientów",
    "description": "Codziennie 10 prób kontaktu z potencjalnymi klientami – buduję relacje i rozwijam komunikację",
    "category": "work",
    "frequency": [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday"
    ],
    "createdAt": "2025-03-27T00:00:00",
    "completedTask": false,
    "streakCount": 14,
    "isArchived": false,
    "relativeHistory": [
      {
        "offset": -59,
        "streakAtThatDay": 1
      },
      {
        "offset": -58,
        "streakAtThatDay": 2
      },
      {
        "offset": -57,
        "streakAtThatDay": 3
      },
      {
        "offset": -56,
        "streakAtThatDay": 4
      },
      {
        "offset": -55,
        "streakAtThatDay": 5
      },
      {
        "offset": -52,
        "streakAtThatDay": 6
      },
      {
        "offset": -51,
        "streakAtThatDay": 7
      },
      {
        "offset": -50,
        "streakAtThatDay": 8
      },
      {
        "offset": -49,
        "streakAtThatDay": 9
      },
      {
        "offset": -48,
        "streakAtThatDay": 10
      },
      {
        "offset": -45,
        "streakAtThatDay": 11
      },
      {
        "offset": -44,
        "streakAtThatDay": 12
      },
      {
        "offset": -43,
        "streakAtThatDay": 0
      },
      {
        "offset": -42,
        "streakAtThatDay": -1
      },
      {
        "offset": -41,
        "streakAtThatDay": -2
      },
      {
        "offset": -38,
        "streakAtThatDay": 1
      },
      {
        "offset": -37,
        "streakAtThatDay": 2
      },
      {
        "offset": -36,
        "streakAtThatDay": 3
      },
      {
        "offset": -35,
        "streakAtThatDay": 4
      },
      {
        "offset": -34,
        "streakAtThatDay": 5
      },
      {
        "offset": -31,
        "streakAtThatDay": 6
      },
      {
        "offset": -30,
        "streakAtThatDay": 7
      },
      {
        "offset": -29,
        "streakAtThatDay": 8
      },
      {
        "offset": -28,
        "streakAtThatDay": 9
      },
      {
        "offset": -27,
        "streakAtThatDay": 10
      },
      {
        "offset": -24,
        "streakAtThatDay": 11
      },
      {
        "offset": -23,
        "streakAtThatDay": 0
      },
      {
        "offset": -22,
        "streakAtThatDay": -1
      },
      {
        "offset": -21,
        "streakAtThatDay": -2
      },
      {
        "offset": -20,
        "streakAtThatDay": 1
      },
      {
        "offset": -17,
        "streakAtThatDay": 2
      },
      {
        "offset": -16,
        "streakAtThatDay": 3
      },
      {
        "offset": -15,
        "streakAtThatDay": 4
      },
      {
        "offset": -14,
        "streakAtThatDay": 5
      },
      {
        "offset": -13,
        "streakAtThatDay": 6
      },
      {
        "offset": -10,
        "streakAtThatDay": 7
      },
      {
        "offset": -9,
        "streakAtThatDay": 8
      },
      {
        "offset": -8,
        "streakAtThatDay": 9
      },
      {
        "offset": -7,
        "streakAtThatDay": 10
      },
      {
        "offset": -6,
        "streakAtThatDay": 11
      },
      {
        "offset": -3,
        "streakAtThatDay": 12
      },
      {
        "offset": -2,
        "streakAtThatDay": 13
      },
      {
        "offset": -1,
        "streakAtThatDay": 14
      }
    ]
  },
  {
    "id": "demo-7",
    "title": "Skarbonka 20",
    "description": "Codziennie odkładam 20 zł na konkretny cel – buduję nawyk świadomego oszczędzania",
    "category": "finance",
    "frequency": [
      "daily"
    ],
    "createdAt": "2025-03-27T00:00:00",
    "completedTask": false,
    "streakCount": 13,
    "isArchived": false,
    "relativeHistory": [
      {
        "offset": -60,
        "streakAtThatDay": 1
      },
      {
        "offset": -59,
        "streakAtThatDay": 2
      },
      {
        "offset": -58,
        "streakAtThatDay": 3
      },
      {
        "offset": -57,
        "streakAtThatDay": 4
      },
      {
        "offset": -56,
        "streakAtThatDay": 5
      },
      {
        "offset": -55,
        "streakAtThatDay": 6
      },
      {
        "offset": -54,
        "streakAtThatDay": 7
      },
      {
        "offset": -53,
        "streakAtThatDay": 0
      },
      {
        "offset": -52,
        "streakAtThatDay": -1
      },
      {
        "offset": -51,
        "streakAtThatDay": -2
      },
      {
        "offset": -50,
        "streakAtThatDay": 1
      },
      {
        "offset": -49,
        "streakAtThatDay": 2
      },
      {
        "offset": -48,
        "streakAtThatDay": 3
      },
      {
        "offset": -47,
        "streakAtThatDay": 4
      },
      {
        "offset": -46,
        "streakAtThatDay": 5
      },
      {
        "offset": -45,
        "streakAtThatDay": 0
      },
      {
        "offset": -44,
        "streakAtThatDay": -1
      },
      {
        "offset": -43,
        "streakAtThatDay": -2
      },
      {
        "offset": -42,
        "streakAtThatDay": -3
      },
      {
        "offset": -41,
        "streakAtThatDay": 1
      },
      {
        "offset": -40,
        "streakAtThatDay": 2
      },
      {
        "offset": -39,
        "streakAtThatDay": 3
      },
      {
        "offset": -38,
        "streakAtThatDay": 4
      },
      {
        "offset": -37,
        "streakAtThatDay": 5
      },
      {
        "offset": -36,
        "streakAtThatDay": 6
      },
      {
        "offset": -35,
        "streakAtThatDay": 7
      },
      {
        "offset": -34,
        "streakAtThatDay": 8
      },
      {
        "offset": -33,
        "streakAtThatDay": 9
      },
      {
        "offset": -32,
        "streakAtThatDay": 10
      },
      {
        "offset": -31,
        "streakAtThatDay": 11
      },
      {
        "offset": -30,
        "streakAtThatDay": 12
      },
      {
        "offset": -29,
        "streakAtThatDay": 13
      },
      {
        "offset": -28,
        "streakAtThatDay": 14
      },
      {
        "offset": -27,
        "streakAtThatDay": 15
      },
      {
        "offset": -26,
        "streakAtThatDay": 16
      },
      {
        "offset": -25,
        "streakAtThatDay": 17
      },
      {
        "offset": -24,
        "streakAtThatDay": 18
      },
      {
        "offset": -23,
        "streakAtThatDay": 19
      },
      {
        "offset": -22,
        "streakAtThatDay": 20
      },
      {
        "offset": -21,
        "streakAtThatDay": 21
      },
      {
        "offset": -20,
        "streakAtThatDay": 22
      },
      {
        "offset": -19,
        "streakAtThatDay": 23
      },
      {
        "offset": -18,
        "streakAtThatDay": 24
      },
      {
        "offset": -17,
        "streakAtThatDay": 25
      },
      {
        "offset": -16,
        "streakAtThatDay": 0
      },
      {
        "offset": -15,
        "streakAtThatDay": -1
      },
      {
        "offset": -14,
        "streakAtThatDay": -2
      },
      {
        "offset": -13,
        "streakAtThatDay": 1
      },
      {
        "offset": -12,
        "streakAtThatDay": 2
      },
      {
        "offset": -11,
        "streakAtThatDay": 3
      },
      {
        "offset": -10,
        "streakAtThatDay": 4
      },
      {
        "offset": -9,
        "streakAtThatDay": 5
      },
      {
        "offset": -8,
        "streakAtThatDay": 6
      },
      {
        "offset": -7,
        "streakAtThatDay": 7
      },
      {
        "offset": -6,
        "streakAtThatDay": 8
      },
      {
        "offset": -5,
        "streakAtThatDay": 9
      },
      {
        "offset": -4,
        "streakAtThatDay": 10
      },
      {
        "offset": -3,
        "streakAtThatDay": 11
      },
      {
        "offset": -2,
        "streakAtThatDay": 12
      },
      {
        "offset": -1,
        "streakAtThatDay": 13
      }
    ]
  }
];

export default mockGoals;
