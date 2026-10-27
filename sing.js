'use strict';

(() => {

let Sequencer;
let WorkletSynthesizer;

        /* ===================================================================

           1. DEFAULT FALLBACK DATA (Used if songs.json is missing or offline)

           =================================================================== */

        const FALLBACK_DATA = {

  "title": "SingSprout Christmas Karaoke",

  "version": 1,

  "notes": "Place each named MIDI file in the same directory as index.html and songs.json. Lyric startBeat values are starter estimates, not verified against a specific arrangement.",

  "songs": [

    {

      "id": "jingle-bells",

      "title": "Jingle Bells",

      "midi": "Jingle_Bells.mid",

      "emoji": "🔔",

      "theme": "peach",

      "bpmHint": 116,

      "description": "A bouncy sleigh-ride favourite",

      "mood": "Sleigh ride",

      "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

      "lyrics": [

        {

          "text": "Jingle bells, jingle bells",

          "startBeat": 0,

          "stanza": 1

        },

        {

          "text": "Jingle all the way",

          "startBeat": 8,

          "stanza": 1

        },

        {

          "text": "Oh, what fun it is to ride",

          "startBeat": 16,

          "stanza": 1

        },

        {

          "text": "In a one-horse open sleigh, hey",

          "startBeat": 24,

          "stanza": 1

        },

        {

          "text": "Jingle bells, jingle bells",

          "startBeat": 32,

          "stanza": 1

        },

        {

          "text": "Jingle all the way",

          "startBeat": 40,

          "stanza": 1

        },

        {

          "text": "Oh, what fun it is to ride",

          "startBeat": 48,

          "stanza": 1

        },

        {

          "text": "In a one-horse open sleigh",

          "startBeat": 56,

          "stanza": 1

        },

        {

          "text": "Dashing through the snow",

          "startBeat": 64,

          "stanza": 2

        },

        {

          "text": "In a one-horse open sleigh",

          "startBeat": 72,

          "stanza": 2

        },

        {

          "text": "O’er the fields we go",

          "startBeat": 80,

          "stanza": 2

        },

        {

          "text": "Laughing all the way",

          "startBeat": 88,

          "stanza": 2

        },

        {

          "text": "Bells on bobtails ring",

          "startBeat": 96,

          "stanza": 2

        },

        {

          "text": "Making spirits bright",

          "startBeat": 104,

          "stanza": 2

        },

        {

          "text": "What fun it is to ride and sing",

          "startBeat": 112,

          "stanza": 2

        },

        {

          "text": "A sleighing song tonight",

          "startBeat": 120,

          "stanza": 2

        },

        {

          "text": "Jingle bells, jingle bells",

          "startBeat": 128,

          "stanza": 3

        },

        {

          "text": "Jingle all the way",

          "startBeat": 136,

          "stanza": 3

        },

        {

          "text": "Oh, what fun it is to ride",

          "startBeat": 144,

          "stanza": 3

        },

        {

          "text": "In a one-horse open sleigh, hey",

          "startBeat": 152,

          "stanza": 3

        },

        {

          "text": "Jingle bells, jingle bells",

          "startBeat": 160,

          "stanza": 3

        },

        {

          "text": "Jingle all the way",

          "startBeat": 168,

          "stanza": 3

        },

        {

          "text": "Oh, what fun it is to ride",

          "startBeat": 176,

          "stanza": 3

        },

        {

          "text": "In a one-horse open sleigh",

          "startBeat": 184,

          "stanza": 3

        }

      ]

    },

    {

      "id": "deck-the-halls",

      "title": "Deck the Halls",

      "midi": "Deck_the_Halls.mid",

      "emoji": "🎀",

      "theme": "lavender",

      "bpmHint": 118,

      "description": "Fa-la-la fun for the whole family",

      "mood": "Festive cheer",

      "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

      "lyrics": [

        {

          "text": "Deck the halls with boughs of holly",

          "startBeat": 0,

          "stanza": 1

        },

        {

          "text": "Fa-la-la-la-la, la-la-la-la",

          "startBeat": 8,

          "stanza": 1

        },

        {

          "text": "’Tis the season to be jolly",

          "startBeat": 16,

          "stanza": 1

        },

        {

          "text": "Fa-la-la-la-la, la-la-la-la",

          "startBeat": 24,

          "stanza": 1

        },

        {

          "text": "Don we now our gay apparel",

          "startBeat": 32,

          "stanza": 1

        },

        {

          "text": "Fa-la-la, la-la-la, la-la-la",

          "startBeat": 40,

          "stanza": 1

        },

        {

          "text": "Troll the ancient Yuletide carol",

          "startBeat": 48,

          "stanza": 1

        },

        {

          "text": "Fa-la-la-la-la, la-la-la-la",

          "startBeat": 56,

          "stanza": 1

        },

        {

          "text": "See the blazing Yule before us",

          "startBeat": 64,

          "stanza": 2

        },

        {

          "text": "Fa-la-la-la-la, la-la-la-la",

          "startBeat": 72,

          "stanza": 2

        },

        {

          "text": "Strike the harp and join the chorus",

          "startBeat": 80,

          "stanza": 2

        },

        {

          "text": "Fa-la-la-la-la, la-la-la-la",

          "startBeat": 88,

          "stanza": 2

        },

        {

          "text": "Follow me in merry measure",

          "startBeat": 96,

          "stanza": 2

        },

        {

          "text": "Fa-la-la-la-la, la-la-la-la",

          "startBeat": 104,

          "stanza": 2

        },

        {

          "text": "While I tell of Yule-tide treasure",

          "startBeat": 112,

          "stanza": 2

        },

        {

          "text": "Fa-la-la-la-la, la-la-la-la",

          "startBeat": 120,

          "stanza": 2

        }

      ]

    },

    {

      "id": "we-wish",

      "title": "We Wish You a Merry Christmas",

      "midi": "We_Wish_You_A_Merry_Christmas.mid",

      "emoji": "🎁",

      "theme": "mint",

      "bpmHint": 108,

      "description": "A friendly holiday greeting in song",

      "mood": "Holiday wishes",

      "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

      "lyrics": [

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 0,

          "stanza": 1

        },

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 6,

          "stanza": 1

        },

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 12,

          "stanza": 1

        },

        {

          "text": "And a happy New Year",

          "startBeat": 18,

          "stanza": 1

        },

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 24,

          "stanza": 1

        },

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 30,

          "stanza": 1

        },

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 36,

          "stanza": 1

        },

        {

          "text": "And a happy New Year",

          "startBeat": 42,

          "stanza": 1

        },

        {

          "text": "Good tidings we bring",

          "startBeat": 48,

          "stanza": 2

        },

        {

          "text": "To you and your kin",

          "startBeat": 54,

          "stanza": 2

        },

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 60,

          "stanza": 2

        },

        {

          "text": "And a happy New Year",

          "startBeat": 66,

          "stanza": 2

        },

        {

          "text": "Oh, bring us some figgy pudding",

          "startBeat": 72,

          "stanza": 3

        },

        {

          "text": "Oh, bring us some figgy pudding",

          "startBeat": 78,

          "stanza": 3

        },

        {

          "text": "Oh, bring us some figgy pudding",

          "startBeat": 84,

          "stanza": 3

        },

        {

          "text": "And bring it right here",

          "startBeat": 90,

          "stanza": 3

        },

        {

          "text": "Good tidings we bring",

          "startBeat": 96,

          "stanza": 4

        },

        {

          "text": "To you and your kin",

          "startBeat": 102,

          "stanza": 4

        },

        {

          "text": "We wish you a Merry Christmas",

          "startBeat": 108,

          "stanza": 4

        },

        {

          "text": "And a happy New Year",

          "startBeat": 114,

          "stanza": 4

        },

        {

          "text": "For we all like figgy pudding",

          "startBeat": 120,

          "stanza": 5

        },

        {

          "text": "We all like figgy pudding",

          "startBeat": 126,

          "stanza": 5

        },

        {

          "text": "We all like figgy pudding",

          "startBeat": 132,

          "stanza": 5

        },

        {

          "text": "And bring some out here",

          "startBeat": 138,

          "stanza": 5

        },

        {

          "text": "For we all like figgy pudding",

          "startBeat": 144,

          "stanza": 5

        },

        {

          "text": "We all like figgy pudding",

          "startBeat": 150,

          "stanza": 5

        },

        {

          "text": "We all like figgy pudding",

          "startBeat": 156,

          "stanza": 5

        },

        {

          "text": "And bring some out here",

          "startBeat": 162,

          "stanza": 5

        }

      ]

    },

    {

      "id": "the-first-noel",

      "title": "The First Noel",

      "midi": "First_Nowell.mid",

      "emoji": "⭐",

      "theme": "mint",

      "bpmHint": 90,

      "description": "A gentle, star-lit traditional carol",

      "mood": "Starry night",

      "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

      "lyrics": [

        {

          "text": "The first Noel the angel did say",

          "startBeat": 0,

          "stanza": 1

        },

        {

          "text": "Was to certain poor shepherds in fields as they lay",

          "startBeat": 12,

          "stanza": 1

        },

        {

          "text": "In fields where they lay keeping their sheep",

          "startBeat": 24,

          "stanza": 1

        },

        {

          "text": "On a cold winter’s night that was so deep",

          "startBeat": 36,

          "stanza": 1

        },

        {

          "text": "Noel, Noel, Noel, Noel",

          "startBeat": 48,

          "stanza": 1

        },

        {

          "text": "Born is the King of Israel",

          "startBeat": 60,

          "stanza": 1

        },

        {

          "text": "They looked up and saw a star",

          "startBeat": 72,

          "stanza": 2

        },

        {

          "text": "Shining in the east beyond them far",

          "startBeat": 84,

          "stanza": 2

        },

        {

          "text": "And to the earth it gave great light",

          "startBeat": 96,

          "stanza": 2

        },

        {

          "text": "And so it continued both day and night",

          "startBeat": 108,

          "stanza": 2

        },

        {

          "text": "Noel, Noel, Noel, Noel",

          "startBeat": 120,

          "stanza": 2

        },

        {

          "text": "Born is the King of Israel",

          "startBeat": 132,

          "stanza": 2

        }

      ]

    },

    {

      "id": "o-come-all-ye-faithful",

      "title": "O Come, All Ye Faithful",

      "midi": "o-come-all-ye-faithful.mid",

      "emoji": "🕯️",

      "theme": "lavender",

      "bpmHint": 100,

      "description": "A welcoming carol made for singing together",

      "mood": "Come and sing",

      "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

      "lyrics": [

        {

          "text": "O come all ye faithful",

          "startBeat": 0,

          "stanza": 1

        },

        {

          "text": "Joyful and triumphant",

          "startBeat": 10,

          "stanza": 1

        },

        {

          "text": "O come ye",

          "startBeat": 18,

          "stanza": 1

        },

        {

          "text": "O come ye to Bethlehem",

          "startBeat": 22,

          "stanza": 1

        },

        {

          "text": "Come and behold Him",

          "startBeat": 35,

          "stanza": 1

        },

        {

          "text": "Born the King of angels",

          "startBeat": 43,

          "stanza": 1

        },

        {

          "text": "O come let us adore Him",

          "startBeat": 50,

          "stanza": 1

        },

        {

          "text": "O come let us adore Him",

          "startBeat": 58,

          "stanza": 1

        },

        {

          "text": "O come let us adore Him",

          "startBeat": 66,

          "stanza": 1

        },

        {

          "text": "Christ the Lord",

          "startBeat": 74,

          "stanza": 1

        },

        {

          "text": "Sing choirs of angels",

          "startBeat": 84,

          "stanza": 2

        },

        {

          "text": "Sing in exultation",

          "startBeat": 92,

          "stanza": 2

        },

        {

          "text": "Sing all ye",

          "startBeat": 100,

          "stanza": 2

        },

        {

          "text": "Citizens of heaven above",

          "startBeat": 103,

          "stanza": 2

        },

        {

          "text": "Glory to God",

          "startBeat": 115,

          "stanza": 2

        },

        {

          "text": "All glory in the highest",

          "startBeat": 123,

          "stanza": 2

        },

        {

          "text": "O come, let us adore Him",

          "startBeat": 130,

          "stanza": 2

        },

        {

          "text": "O come, let us adore Him",

          "startBeat": 138,

          "stanza": 2

        },

        {

          "text": "O come, let us adore Him",

          "startBeat": 146,

          "stanza": 2

        },

        {

          "text": "Christ the Lord",

          "startBeat": 156,

          "stanza": 2

        },

        {

          "text": "Yea Lord we greet thee",

          "startBeat": 162,

          "stanza": 3

        },

        {

          "text": "Born this happy morning",

          "startBeat": 170,

          "stanza": 3

        },

        {

          "text": "Jesus to thee",

          "startBeat": 178,

          "stanza": 3

        },

        {

          "text": "Be all glory giv’n",

          "startBeat": 182,

          "stanza": 3

        },

        {

          "text": "Word of the Father",

          "startBeat": 194,

          "stanza": 3

        },

        {

          "text": "Late in flesh appearing",

          "startBeat": 202,

          "stanza": 3

        },

        {

          "text": "O come let us adore Him",

          "startBeat": 208,

          "stanza": 3

        },

        {

          "text": "O come let us adore Him",

          "startBeat": 216,

          "stanza": 3

        },

        {

          "text": "O come let us adore Him",

          "startBeat": 224,

          "stanza": 3

        },

        {

          "text": "Christ the Lord",

          "startBeat": 234,

          "stanza": 3

        },

        {

          "text": "Sing choirs of angels",

          "startBeat": 244,

          "stanza": 4

        },

        {

          "text": "Sing in exultation",

          "startBeat": 252,

          "stanza": 4

        },

        {

          "text": "Sing all ye",

          "startBeat": 260,

          "stanza": 4

        },

        {

          "text": "Citizens of heaven above",

          "startBeat": 263,

          "stanza": 4

        },

        {

          "text": "Glory to God",

          "startBeat": 275,

          "stanza": 4

        },

        {

          "text": "All glory in the highest",

          "startBeat": 283,

          "stanza": 4

        },

        {

          "text": "O come, let us adore Him",

          "startBeat": 290,

          "stanza": 4

        },

        {

          "text": "O come, let us adore Him",

          "startBeat": 298,

          "stanza": 4

        },

        {

          "text": "O come, let us adore Him",

          "startBeat": 306,

          "stanza": 4

        },

        {

          "text": "Christ the Lord",

          "startBeat": 316,

          "stanza": 4

        }

      ]

    },

    {

  "id": "god-rest-you-merry-gentlemen",

  "title": "God Rest You Merry, Gentlemen",

  "midi": "God_rest_you_merry_Gentlemen.mid",

  "emoji": "🕯️",

  "theme": "sky",

  "bpmHint": 100,

  "description": "Share the joyful message of Christmas",

  "mood": "Joyful and triumphant",

  "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

  "lyrics": [

    {

      "text": "God rest you merry, gentlemen",

      "startBeat": 0,

      "stanza": 1

    },

    {

      "text": "Let nothing you dismay",

      "startBeat": 8,

      "stanza": 1

    },

    {

      "text": "Remember Christ our Savior",

      "startBeat": 16,

      "stanza": 1

    },

    {

      "text": "Was born on Christmas Day",

      "startBeat": 24,

      "stanza": 1

    },

    {

      "text": "To save us all from Satan's power",

      "startBeat": 32,

      "stanza": 1

    },

    {

      "text": "When we were gone astray",

      "startBeat": 40,

      "stanza": 1

    },

    {

      "text": "O tidings of comfort and joy",

      "startBeat": 48,

      "stanza": 1

    },

    {

      "text": "Comfort and joy",

      "startBeat": 58,

      "stanza": 1

    },

    {

      "text": "O tidings of comfort and joy",

      "startBeat": 62,

      "stanza": 1

    },

    {

      "text": "In Bethlehem in Israel",

      "startBeat": 80,

      "stanza": 2

    },

    {

      "text": "This blessed Babe was born",

      "startBeat": 88,

      "stanza": 2

    },

    {

      "text": "And laid within a manger",

      "startBeat": 96,

      "stanza": 2

    },

    {

      "text": "Upon this blessed morn",

      "startBeat": 104,

      "stanza": 2

    },

    {

      "text": "To which His Mother Mary",

      "startBeat": 112,

      "stanza": 2

    },

    {

      "text": "Did nothing take in scorn",

      "startBeat": 120,

      "stanza": 2

    },

    {

      "text": "O tidings of comfort and joy",

      "startBeat": 128,

      "stanza": 3

    },

    {

      "text": "Comfort and joy",

      "startBeat": 138,

      "stanza": 3

    },

    {

      "text": "O tidings of comfort and joy",

      "startBeat": 142,

      "stanza": 3

    },

    {

      "text": "From God our heavenly Father",

      "startBeat": 160,

      "stanza": 3

    },

    {

      "text": "A blessed angel came",

      "startBeat": 168,

      "stanza": 3

    },

    {

      "text": "And unto certain shepherds",

      "startBeat": 176,

      "stanza": 3

    },

    {

      "text": "Brought tidings of the same",

      "startBeat": 184,

      "stanza": 3

    },

    {

      "text": "How that in Bethlehem was born",

      "startBeat": 192,

      "stanza": 3

    },

    {

      "text": "The Son of God by name",

      "startBeat": 200,

      "stanza": 3

    },

    {

      "text": "O tidings of comfort and joy",

      "startBeat": 208,

      "stanza": 3

    },

    {

      "text": "Comfort and joy",

      "startBeat": 218,

      "stanza": 3

    },

    {

      "text": "O tidings of comfort and joy",

      "startBeat": 222,

      "stanza": 3

    }

  ]

},

{

  "id": "hark-the-herald-angels-sing",

  "title": "Hark! The Herald Angels Sing",

  "midi": "Hark_The_Herald_Angels_Sing.mid",

  "emoji": "👼",

  "theme": "peach",

  "bpmHint": 100,

  "description": "Celebrate the angels' joyful announcement",

  "mood": "Festive and glorious",

  "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

  "lyrics": [

    {

      "text": "Hark! The herald angels sing",

      "startBeat": 0,

      "stanza": 1

    },

    {

      "text": "Glory to the newborn King",

      "startBeat": 8,

      "stanza": 1

    },

    {

      "text": "Peace on earth and mercy mild",

      "startBeat": 16,

      "stanza": 1

    },

    {

      "text": "God and sinners reconciled",

      "startBeat": 24,

      "stanza": 1

    },

    {

      "text": "Joyful, all ye nations rise",

      "startBeat": 32,

      "stanza": 1

    },

    {

      "text": "Join the triumph of the skies",

      "startBeat": 40,

      "stanza": 1

    },

    {

      "text": "With the angelic host proclaim",

      "startBeat": 48,

      "stanza": 1

    },

    {

      "text": "Christ is born in Bethlehem",

      "startBeat": 56,

      "stanza": 1

    },

    {

      "text": "Hark! The herald angels sing",

      "startBeat": 64,

      "stanza": 1

    },

    {

      "text": "Glory to the newborn King",

      "startBeat": 72,

      "stanza": 1

    },

    {

      "text": "Christ, by highest heaven adored",

      "startBeat": 80,

      "stanza": 2

    },

    {

      "text": "Christ, the everlasting Lord",

      "startBeat": 88,

      "stanza": 2

    },

    {

      "text": "Late in time behold Him come",

      "startBeat": 96,

      "stanza": 2

    },

    {

      "text": "Offspring of a virgin's womb",

      "startBeat": 104,

      "stanza": 2

    },

    {

      "text": "Veiled in flesh the Godhead see",

      "startBeat": 112,

      "stanza": 2

    },

    {

      "text": "Hail the incarnate Deity",

      "startBeat": 120,

      "stanza": 2

    },

    {

      "text": "Pleased as man with man to dwell",

      "startBeat": 128,

      "stanza": 2

    },

    {

      "text": "Jesus, our Emmanuel",

      "startBeat": 136,

      "stanza": 2

    },

    {

      "text": "Hark! The herald angels sing",

      "startBeat": 144,

      "stanza": 2

    },

    {

      "text": "Glory to the newborn King",

      "startBeat": 152,

      "stanza": 2

    }

  ]

},

    {

      "id": "good-king-wenceslas",

      "title": "Good King Wenceslas",

      "midi": "Good_King_Wenceslas.mid",

      "emoji": "❄️",

      "theme": "sky",

      "bpmHint": 104,

      "description": "A wintry story about kindness",

      "mood": "Winter story",

      "timingNote": "Starter cue points: each lyric line begins four quarter-note beats after the previous one. Adjust startBeat to match the exact MIDI arrangement.",

      "lyrics": [

        {

          "text": "Good King Wenceslas looked out",

          "startBeat": 0,

          "stanza": 1

        },

        {

          "text": "On the Feast of Stephen",

          "startBeat": 8,

          "stanza": 1

        },

        {

          "text": "When the snow lay round about",

          "startBeat": 16,

          "stanza": 1

        },

        {

          "text": "Deep and crisp and even",

          "startBeat": 24,

          "stanza": 1

        },

        {

          "text": "Brightly shone the moon that night",

          "startBeat": 32,

          "stanza": 1

        },

        {

          "text": "Though the frost was cruel",

          "startBeat": 40,

          "stanza": 1

        },

        {

          "text": "When a poor man came in sight",

          "startBeat": 48,

          "stanza": 2

        },

        {

          "text": "Gathering winter fuel",

          "startBeat": 56,

          "stanza": 2

        },

        {

          "text": "Hither, page, and stand by me",

          "startBeat": 64,

          "stanza": 2

        },

        {

          "text": "If thou know’st it, telling",

          "startBeat": 72,

          "stanza": 2

        },

        {

          "text": "Yonder peasant, who is he",

          "startBeat": 80,

          "stanza": 2

        },

        {

          "text": "Where and what his dwelling",

          "startBeat": 88,

          "stanza": 2

        }

      ]

    }

  ]

};





const $ = id => document.getElementById(id);

const SOUND_FONT_URL = 'https://spessasus.github.io/SpessaSynth/soundfonts/GeneralUserGS.sf3';

const WORKLET_URL = 'https://cdn.jsdelivr.net/npm/spessasynth_lib@4.3.14/dist/spessasynth_processor.min.js';

let songs = [], songIndex = 0, audioCtx = null, masterGain = null, synth = null, sequencer = null;

let midiData = null, lineCues = [], durationSec = 0, playing = false, paused = false, ended = false, rafId = 0, speed = 1, volume = .6, activeLine = -1;

let lyricOnly = false, lastError = '';

const currentSong = () => songs[songIndex];

const fmt = seconds => { const s = Math.max(0, Math.floor(seconds || 0)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; };

function setStatus(message, live=false) { $('statusText').textContent = message; $('playStatus').classList.toggle('live', !!live); }

function showWarning(message) { const el=$('warningBox'); el.textContent=message; el.classList.add('show'); }

function clearWarning() { $('warningBox').textContent=''; $('warningBox').classList.remove('show'); }

function updatePlayButton() { if(playing){$('playIcon').textContent='Ⅱ';$('playLabel').textContent='Pause music';} else if(paused){$('playIcon').textContent='▶';$('playLabel').textContent='Keep singing';} else if(ended){$('playIcon').textContent='↻';$('playLabel').textContent='Sing again';} else {$('playIcon').textContent='▶';$('playLabel').textContent='Start singing';} }

function updateProgress(elapsed) { const val=Math.max(0,Math.min(durationSec,elapsed||0)); const pct=durationSec?val/durationSec*100:0; $('progressFill').style.width=`${pct}%`; $('progressTrack').setAttribute('aria-valuenow',String(Math.round(pct))); $('elapsedText').textContent=fmt(val); $('durationText').textContent=fmt(durationSec); }

function renderCards() {

 const query=$('songSearch').value.trim().toLowerCase(); const root=$('songGrid'); root.innerHTML=''; let visible=0;

 songs.forEach((song,index)=>{if(query&&!`${song.title} ${song.description} ${song.mood}`.toLowerCase().includes(query))return; visible++;

  const b=document.createElement('button'); b.type='button'; b.className=`song-card${index===songIndex?' selected':''}`; b.dataset.theme=song.theme; b.setAttribute('aria-pressed',String(index===songIndex));

  const emoji=document.createElement('span'); emoji.className='song-emoji'; emoji.textContent=song.emoji; emoji.setAttribute('aria-hidden','true');

  const title=document.createElement('strong'); title.textContent=song.title;

  const desc=document.createElement('span'); desc.className='desc'; desc.textContent=song.description;

  const meta=document.createElement('span'); meta.className='song-meta'; const t1=document.createElement('span');t1.className='tag';t1.textContent='♫ '+song.mood; const t2=document.createElement('span');t2.className='tag';t2.textContent=song.lyrics.length+' lines'; meta.append(t1,t2); b.append(emoji,title,desc,meta); b.addEventListener('click',()=>chooseSong(index)); root.appendChild(b);

 });

 $('songCount').textContent=query?`${visible} of ${songs.length} songs`:`${songs.length} songs`; if(!visible)root.innerHTML='<div class="empty-state">No songs found. Try another title or keyword.</div>';

}

function renderLyrics() {

 const root=$('lyricsWindow'); root.innerHTML=''; const song=currentSong();

 song.lyrics.forEach((line,i)=>{const el=document.createElement('div');el.className='lyric-line';el.id=`lyric-${i}`;el.textContent=line.text;root.appendChild(el);}); activeLine=-1;

 if(song.lyrics.length)highlight(0,false);

}

function updateHeader() { const s=currentSong(); $('coverEmoji').textContent=s.emoji; $('stageSongTitle').textContent=s.title; $('stageSongMeta').textContent=`${s.mood} · MIDI file: ${s.midi}`; }

function chooseSong(index) { haltAudio(); songIndex=index; midiData=null; lineCues=[]; playing=false; paused=false; ended=false; lyricOnly=false; durationSec=0; renderCards();renderLyrics();updateHeader();updateProgress(0);setStatus('Ready to sing');updatePlayButton();clearWarning(); }

function haltAudio() {

    if (sequencer) {

        try {

            sequencer.pause();

            sequencer.currentTime = 0;

        } catch (e) {}

    }

    if (rafId) cancelAnimationFrame(rafId);

    rafId = 0;

}



async function getPlayer() {

    if (sequencer) return;

    // Load the audio library only when playback is requested. Song browsing
    // remains available even if the audio CDN is temporarily unavailable.
    if (!Sequencer || !WorkletSynthesizer) {
        // spessasynth_lib@4.3.14 was built against spessasynth_core@4.3.20.
        // Do not let the CDN silently resolve the dependency to a newer version:
        // that can cause runtime export errors such as missing KeyModifier.
        const audioLibraryUrls = [
            'https://esm.sh/spessasynth_lib@4.3.14?bundle&deps=spessasynth_core@4.3.20',
            'https://esm.sh/spessasynth_lib@4.3.14?deps=spessasynth_core@4.3.20'
        ];
        const importErrors = [];

        for (const url of audioLibraryUrls) {
            try {
                const audioLibrary = await import(url);
                if (typeof audioLibrary.Sequencer !== 'function' ||
                    typeof audioLibrary.WorkletSynthesizer !== 'function') {
                    throw new Error('The audio library did not provide Sequencer and WorkletSynthesizer.');
                }
                Sequencer = audioLibrary.Sequencer;
                WorkletSynthesizer = audioLibrary.WorkletSynthesizer;
                break;
            } catch (error) {
                importErrors.push(error?.message || String(error));
                console.warn('SpessaSynth import attempt failed:', url, error);
            }
        }

        if (!Sequencer || !WorkletSynthesizer) {
            throw new Error(
                'Could not load a compatible SpessaSynth audio library. The app pins ' +
                'spessasynth_lib 4.3.14 with spessasynth_core 4.3.20 to prevent the ' +
                'KeyModifier export mismatch. Check your internet connection and reload. ' +
                importErrors.join(' | ')
            );
        }
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {

        throw new Error('Audio is not supported by this browser. Try a recent Chrome, Edge, or Safari.');

    }



    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();

    masterGain.gain.value = volume;

    masterGain.connect(audioCtx.destination);



    // The processor and library use the same pinned release.

    await audioCtx.audioWorklet.addModule(WORKLET_URL);

    synth = new WorkletSynthesizer(audioCtx);

    synth.connect(masterGain);



    const response = await fetch(SOUND_FONT_URL, { cache: 'force-cache' });

    if (!response.ok) {

        throw new Error('Could not load the General MIDI instrument SoundFont. Check your internet connection and try again.');

    }

    const soundBank = await response.arrayBuffer();

    await synth.soundBankManager.addSoundBank(soundBank, 'main');



    sequencer = new Sequencer(synth);

    sequencer.loopCount = 0;

}

function readU16(bytes,pos) { return (bytes[pos]<<8)|bytes[pos+1]; }

function readU32(bytes,pos) { return (bytes[pos]*16777216)+(bytes[pos+1]<<16)+(bytes[pos+2]<<8)+bytes[pos+3]; }

function readVar(bytes,state,end) { let value=0, count=0, byte; do { if(state.pos>=end)throw new Error('Unexpected end of MIDI data while reading event length.'); byte=bytes[state.pos++]; value=(value<<7)|(byte&127); if(++count>4)throw new Error('Invalid MIDI variable-length number.'); } while(byte&128); return value; }

function ascii(bytes,pos,count) { return String.fromCharCode(...bytes.slice(pos,pos+count)); }

function parseMidi(buffer) {

 const bytes=new Uint8Array(buffer); if(bytes.length<14||ascii(bytes,0,4)!=='MThd')throw new Error('This file is not a standard MIDI file.');

 const headerLen=readU32(bytes,4); const format=readU16(bytes,8); const trackCount=readU16(bytes,10); const division=readU16(bytes,12); if(division&0x8000)throw new Error('SMPTE-time MIDI is not supported; please use a standard beats-per-minute MIDI file.');

 const ppq=division; if(!ppq)throw new Error('This MIDI file has an invalid timing division.'); let offset=8+headerLen; const tempoEvents=[{tick:0, micros:500000}]; const tracks=[]; let maxTick=0;

 for(let tr=0;tr<trackCount&&offset+8<=bytes.length;tr++) {

  const type=ascii(bytes,offset,4), length=readU32(bytes,offset+4), begin=offset+8, end=Math.min(begin+length,bytes.length); offset=begin+length; if(type!=='MTrk')continue;

  const state={pos:begin}; let tick=0, running=0, lastTick=0; const notes=[]; const programs=Array(16).fill(0); const active=new Map();

  while(state.pos<end) {

   tick+=readVar(bytes,state,end); lastTick=tick; if(state.pos>=end)break;

   let status, firstData=null; const peek=bytes[state.pos];

   if(peek&128){status=bytes[state.pos++];if(status<240)running=status;} else {status=running;firstData=bytes[state.pos++];if(!status)throw new Error('MIDI event has no running status.');}

   if(status===255){ if(state.pos>=end)break; const meta=bytes[state.pos++], n=readVar(bytes,state,end); if(meta===81&&n>=3&&state.pos+2<end){const micros=(bytes[state.pos]<<16)|(bytes[state.pos+1]<<8)|bytes[state.pos+2];tempoEvents.push({tick,micros});} state.pos=Math.min(end,state.pos+n); continue; }

   if(status===240||status===247){const n=readVar(bytes,state,end);state.pos=Math.min(end,state.pos+n);continue;}

   if(status>=240)continue;

   const kind=status>>4, channel=status&15; let d1=firstData===null?bytes[state.pos++]:firstData; let d2=0; if(kind!==12&&kind!==13)d2=bytes[state.pos++];

   if(kind===12){programs[channel]=d1;continue;}

   if(kind===9&&d2>0){const key=channel+':'+d1; if(!active.has(key))active.set(key,[]);active.get(key).push({tick,pitch:d1,velocity:d2/127,channel,program:programs[channel],percussion:channel===9});}

   else if(kind===8||(kind===9&&d2===0)){const key=channel+':'+d1, stack=active.get(key); if(stack&&stack.length){const note=stack.pop();note.endTick=Math.max(tick,note.tick+1);notes.push(note);if(!stack.length)active.delete(key);}}

  }

  maxTick=Math.max(maxTick,lastTick); for(const stack of active.values())for(const note of stack){note.endTick=Math.max(lastTick,note.tick+ppq/2);notes.push(note);maxTick=Math.max(maxTick,note.endTick);}

  tracks.push({notes});

 }

 tempoEvents.sort((a,b)=>a.tick-b.tick); const tempos=[]; for(const ev of tempoEvents){if(tempos.length&&tempos[tempos.length-1].tick===ev.tick)tempos[tempos.length-1]=ev;else tempos.push(ev);} if(!tempos.length||tempos[0].tick!==0)tempos.unshift({tick:0,micros:500000});

 function tickToSeconds(target){let sec=0,prev=0,micros=500000;for(const t of tempos){if(t.tick===0){micros=t.micros;continue;}if(t.tick>target)break;sec+=(t.tick-prev)/ppq*micros/1000000;prev=t.tick;micros=t.micros;}sec+=(target-prev)/ppq*micros/1000000;return sec;}

 let duration=0,totalNotes=0; for(const track of tracks){track.notes.forEach(n=>{n.time=tickToSeconds(n.tick);n.duration=Math.max(.05,tickToSeconds(n.endTick)-n.time);delete n.tick;delete n.endTick;duration=Math.max(duration,n.time+n.duration);totalNotes++;});}

 if(!totalNotes)throw new Error('This MIDI file has no playable notes.'); return {format,ppq,tracks,tempos,duration,totalNotes,tickToSeconds};

}

async function fetchMidi(song) {

    const response = await fetch(song.midi, { cache: 'no-store' });

    if (!response.ok) {

        throw new Error(`Could not find ${song.midi}. Put the original MIDI file in the same directory as index.html and songs.json.`);

    }

    const buffer = await response.arrayBuffer();

    return { buffer, parsed: parseMidi(buffer) };

}

function beatToSeconds(beat) { return midiData.tickToSeconds(Math.max(0,beat)*midiData.ppq); }

function prepareTimeline(song) { lineCues=song.lyrics.map((line,index)=>({index,time:beatToSeconds(line.startBeat||0),text:line.text})); lineCues.sort((a,b)=>a.time-b.time); durationSec=Math.max(midiData.duration,(lineCues.length?lineCues[lineCues.length-1].time+2:0)); }

async function startPlayback() {

    try {

        clearWarning();

        haltAudio();

        playing = false;

        paused = false;

        ended = false;

        lyricOnly = false;

        setStatus('Loading original MIDI…');

        updatePlayButton();



        await getPlayer();

        if (audioCtx.state !== 'running') await audioCtx.resume();



        const loaded = await fetchMidi(currentSong());

        midiData = loaded.parsed;

        prepareTimeline(currentSong());



        sequencer.loadNewSongList([{

            binary: loaded.buffer,

            fileName: currentSong().title

        }]);

        sequencer.playbackRate = speed;

        sequencer.play();



        playing = true;

        paused = false;

        ended = false;

        setStatus('Playing original MIDI arrangement', true);

        updatePlayButton();

        updateProgress(0);

        renderFrame();

    } catch (e) {

        playing = false;

        paused = false;

        updatePlayButton();

        lastError = e.message || 'Could not play the original MIDI file.';

        setStatus('MIDI playback unavailable');

        showWarning(lastError);

    }

}



async function togglePlayback() {

    if (playing) {

        if (sequencer) sequencer.pause();

        playing = false;

        paused = true;

        if (rafId) cancelAnimationFrame(rafId);

        rafId = 0;

        setStatus('Paused — take a breath');

        updatePlayButton();

        return;

    }



    if (paused && sequencer && midiData) {

        try {

            if (audioCtx.state !== 'running') await audioCtx.resume();

            sequencer.playbackRate = speed;

            sequencer.play();

            playing = true;

            paused = false;

            setStatus('Music is playing', true);

            updatePlayButton();

            renderFrame();

            return;

        } catch (e) {

            // Reload the selected original MIDI if resume fails.

        }

    }

    await startPlayback();

}



function stopAndRewind() {

    haltAudio();

    playing = false;

    paused = false;

    ended = false;

    highlight(0, false);

    updateProgress(0);

    setStatus('Ready to sing');

    updatePlayButton();

}



function highlight(index,scroll=true) { $('lyricsWindow').querySelectorAll('.lyric-line').forEach((el,n)=>{el.classList.toggle('active',n===index);el.classList.toggle('done',n<index);if(n===index&&scroll)el.scrollIntoView({behavior:'smooth',block:'center'});});activeLine=index; }

function renderFrame() {

    if (!playing || !sequencer) return;



    const elapsed = Math.max(0, Number(sequencer.currentTime) || 0);

    const musicDuration = midiData ? midiData.duration : durationSec;

    const finished = (!!sequencer.isFinished && elapsed > 0.05) ||

        (musicDuration > 0 && elapsed >= musicDuration);



    if (finished) {

        playing = false;

        paused = false;

        ended = true;

        updateProgress(durationSec);

        if (currentSong().lyrics.length) highlight(currentSong().lyrics.length - 1, false);

        setStatus('Wonderful singing! ✨');

        updatePlayButton();

        rafId = 0;

        return;

    }



    let line = 0;

    for (let i = 0; i < lineCues.length; i++) {

        if (lineCues[i].time <= elapsed) line = i;

        else break;

    }

    if (line !== activeLine) highlight(line, true);

    updateProgress(Math.min(elapsed, durationSec));

    rafId = requestAnimationFrame(renderFrame);

}

async function loadSongs() {

  try {

    const response = await fetch('./songs.json', { cache: 'no-store' });



    if (!response.ok) {

      throw new Error('Could not load songs.json');

    }



    const data = await response.json();



    if (!Array.isArray(data.songs) || !data.songs.length) {

      throw new Error('songs.json has no songs list');

    }



    return data.songs;

  } catch (error) {

    console.warn('Could not load songs.json. Using FALLBACK_DATA instead.', error);



    if (Array.isArray(FALLBACK_DATA.songs) && FALLBACK_DATA.songs.length) {

      return FALLBACK_DATA.songs;

    }



    throw new Error('Neither songs.json nor FALLBACK_DATA contains a valid songs list.');

  }

}$('playBtn').addEventListener('click',togglePlayback);$('stopBtn').addEventListener('click',stopAndRewind);$('songSearch').addEventListener('input',renderCards);

$('volumeSlider').addEventListener('input',e=>{volume=Number(e.target.value)/100;$('volumeValue').textContent=e.target.value+'%';if(masterGain&&audioCtx)masterGain.gain.setTargetAtTime(volume,audioCtx.currentTime,.025);});

$('tempoSlider').addEventListener('input',e=>{speed=Number(e.target.value)/100;$('tempoValue').textContent=e.target.value+'%';if(sequencer)sequencer.playbackRate=speed;});

(async()=>{try{songs=await loadSongs();if(!songs.length)throw new Error('No songs are available.');songIndex=0;renderCards();updateHeader();renderLyrics();setStatus('Ready to sing');updateProgress(0);}catch(e){console.error('SingSprout initialization failed:',e);setStatus('Could not load library');showWarning(e?.message||'An unexpected error occurred while loading the song library.');$('songCount').textContent='Library error';$('stageSongTitle').textContent='Song library unavailable';}})();

})();
