export type ScopedQuestionSpec = {
  id: string;
  sourceId: string;
  prompt: string;
  category: string;
  books?: readonly string[];
  labels?: readonly string[];
};

export type ScopedAnswerAddition = {
  label: string;
  reference: string;
  aliases?: readonly string[];
};

const byBooks = (id: string, sourceId: string, prompt: string, category: string, ...books: string[]): ScopedQuestionSpec =>
  ({ id, sourceId, prompt, category, books });

const byLabels = (id: string, sourceId: string, prompt: string, category: string, ...labels: string[]): ScopedQuestionSpec =>
  ({ id, sourceId, prompt, category, labels });

type QuestionPool = "oldTestament" | "newTestament" | "wholeBible" | "niche";

const RAW_SCOPED_QUESTION_SPECS: Record<QuestionPool, ScopedQuestionSpec[]> = {
  oldTestament: [
    byBooks("women-exodus", "ot-woman", "Name a woman mentioned in Exodus.", "People", "Exodus"),
    byBooks("women-judges", "ot-woman", "Name a woman mentioned in Judges.", "People", "Judges"),
    byBooks("women-first-samuel", "ot-woman", "Name a woman mentioned in 1 Samuel.", "People", "1 Samuel"),
    byBooks("women-second-samuel", "ot-woman", "Name a woman mentioned in 2 Samuel.", "People", "2 Samuel"),
    byBooks("women-second-kings", "ot-woman", "Name a woman mentioned in 2 Kings.", "People", "2 Kings"),
    byBooks("animals-genesis", "bible-animal", "Name an animal mentioned in Genesis.", "Creation", "Genesis"),
    byBooks("animals-exodus", "bible-animal", "Name an animal mentioned in Exodus.", "Creation", "Exodus"),
    byBooks("animals-leviticus", "bible-animal", "Name an animal mentioned in Leviticus.", "Creation", "Leviticus"),
    byBooks("animals-job", "bible-animal", "Name an animal mentioned in Job.", "Creation", "Job"),
    byBooks("animals-psalms", "bible-animal", "Name an animal mentioned in Psalms.", "Creation", "Psalm", "Psalms"),
    byBooks("animals-proverbs", "bible-animal", "Name an animal mentioned in Proverbs.", "Creation", "Proverbs"),
    byBooks("occupations-pentateuch", "bible-occupation", "Name an occupation represented in the Pentateuch.", "Daily Life", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"),
    byBooks("occupations-history", "bible-occupation", "Name an occupation represented in Joshua through Esther.", "Daily Life", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"),
    byBooks("occupations-prophets", "bible-occupation", "Name an occupation represented in the Old Testament prophets.", "Daily Life", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"),
    byBooks("prophets-history", "prophet", "Name a prophet appearing in Joshua through Esther.", "Prophets", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"),
    byBooks("prophets-kings", "prophet", "Name a prophet appearing in 1 or 2 Kings.", "Prophets", "1 Kings", "2 Kings"),
    byBooks("prophets-chronicles", "prophet", "Name a prophet appearing in 1 or 2 Chronicles.", "Prophets", "1 Chronicles", "2 Chronicles"),
    byBooks("prophets-writing-books", "prophet", "Name a prophet whose ministry is recorded in the prophetic books.", "Prophets", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"),
    byBooks("prophets-minor-books", "prophet", "Name a prophet represented among the twelve Minor Prophets.", "Prophets", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"),
    byBooks("mountains-pentateuch", "mountain", "Name a mountain mentioned in the Pentateuch.", "Places", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"),
    byBooks("mountains-history", "mountain", "Name a mountain mentioned in Joshua through Esther.", "Places", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"),
    byBooks("mountains-wisdom", "mountain", "Name a mountain mentioned in Job, Psalms, or the Wisdom books.", "Places", "Job", "Psalm", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"),
    byBooks("dreamers-genesis", "dreamer", "Name someone who has or interprets a dream in Genesis.", "Visions", "Genesis"),
    byBooks("dreamers-major-prophets", "dreamer", "Name a dreamer or dream interpreter in the Major Prophets.", "Visions", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel"),
    byBooks("rivers-pentateuch", "river", "Name a river or stream mentioned in the Pentateuch.", "Places", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"),
    byBooks("rivers-history", "river", "Name a river or stream mentioned in Joshua through Esther.", "Places", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"),
    byBooks("wells-pentateuch", "named-well", "Name a well mentioned in the Pentateuch.", "Places", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"),
    byBooks("wells-history", "named-well", "Name a well mentioned in Joshua through Esther.", "Places", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"),
    byBooks("gates-prophets", "gate", "Name a gate mentioned in an Old Testament prophetic book.", "Places", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"),
    byBooks("gates-nehemiah", "gate", "Name a gate mentioned in Nehemiah.", "Places", "Nehemiah"),
    byBooks("foods-genesis", "biblical-food", "Name a food mentioned in Genesis.", "Daily Life", "Genesis"),
    byBooks("foods-exodus", "biblical-food", "Name a food mentioned in Exodus.", "Daily Life", "Exodus"),
    byBooks("foods-numbers", "biblical-food", "Name a food mentioned in Numbers.", "Daily Life", "Numbers"),
    byBooks("plants-genesis", "biblical-plant", "Name a plant or tree mentioned in Genesis.", "Creation", "Genesis"),
    byBooks("plants-exodus", "biblical-plant", "Name a plant or plant product mentioned in Exodus.", "Creation", "Exodus"),
    byBooks("prayers-prophets", "person-who-prayed", "Name someone who prays in an Old Testament prophetic book.", "Worship", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"),
  ],
  newTestament: [
    byBooks("miracles-matthew", "jesus-miracle", "Name a miracle of Jesus recorded in Matthew.", "Gospels", "Matthew"),
    byBooks("miracles-mark", "jesus-miracle", "Name a miracle of Jesus recorded in Mark.", "Gospels", "Mark"),
    byBooks("miracles-luke", "jesus-miracle", "Name a miracle of Jesus recorded in Luke.", "Gospels", "Luke"),
    byBooks("miracles-john", "jesus-miracle", "Name a miracle of Jesus recorded in John.", "Gospels", "John"),
    byBooks("parables-matthew", "parable", "Name a parable recorded in Matthew.", "Teachings", "Matthew"),
    byBooks("parables-luke", "parable", "Name a parable recorded in Luke.", "Teachings", "Luke"),
    byBooks("jesus-cities-matthew", "jesus-city", "Name a town or city Jesus visits in Matthew.", "Places", "Matthew"),
    byBooks("jesus-cities-mark", "jesus-city", "Name a town or city Jesus visits in Mark.", "Places", "Mark"),
    byBooks("jesus-cities-luke", "jesus-city", "Name a town or city Jesus visits in Luke.", "Places", "Luke"),
    byBooks("jesus-cities-john", "jesus-city", "Name a town or city Jesus visits in John.", "Places", "John"),
    byBooks("healings-mark", "jesus-healed-person", "Name someone Jesus heals in Mark.", "Gospels", "Mark"),
    byBooks("nativity-matthew", "nativity-person", "Name a person in Matthew’s nativity account.", "Gospels", "Matthew"),
    byBooks("nativity-luke", "nativity-person", "Name a person in Luke’s nativity account.", "Gospels", "Luke"),
    byBooks("rulers-luke", "nt-ruler", "Name a ruler or official mentioned in Luke.", "Leaders", "Luke"),
    byBooks("rulers-acts", "nt-ruler", "Name a ruler or official mentioned in Acts.", "Leaders", "Acts"),
    byBooks("women-matthew", "gospel-woman", "Name a woman appearing in Matthew.", "People", "Matthew"),
    byBooks("women-mark", "gospel-woman", "Name a woman appearing in Mark.", "People", "Mark"),
    byBooks("women-luke", "gospel-woman", "Name a woman appearing in Luke.", "People", "Luke"),
    byBooks("women-john", "gospel-woman", "Name a woman appearing in John.", "People", "John"),
    byBooks("prophets-acts", "prophet", "Name a prophet mentioned in Acts.", "Early Church", "Acts"),
    byBooks("dreamers-acts", "dreamer", "Name someone who receives a dream or vision in Acts.", "Visions", "Acts"),
    byBooks("occupations-acts", "bible-occupation", "Name an occupation represented in Acts.", "Daily Life", "Acts"),
    byBooks("companions-acts", "paul-companion", "Name one of Paul’s companions mentioned in Acts.", "Early Church", "Acts"),
    byBooks("companions-first-corinthians", "paul-companion", "Name one of Paul’s associates mentioned in 1 Corinthians.", "Early Church", "1 Corinthians"),
    byBooks("companions-colossians", "paul-companion", "Name one of Paul’s associates mentioned in Colossians.", "Early Church", "Colossians"),
    byBooks("resurrection-matthew", "resurrection-witness", "Name a witness connected to Jesus’ resurrection in Matthew.", "Gospels", "Matthew"),
    byBooks("plants-matthew", "biblical-plant", "Name a plant or tree mentioned in Matthew.", "Creation", "Matthew"),
    byBooks("animals-matthew", "bible-animal", "Name an animal mentioned in Matthew.", "Creation", "Matthew"),
    byBooks("structures-gospels", "biblical-structure", "Name a structure mentioned in the four Gospels.", "Places", "Matthew", "Mark", "Luke", "John"),
    byBooks("clothing-gospels", "biblical-clothing", "Name an article of clothing mentioned in the four Gospels.", "Daily Life", "Matthew", "Mark", "Luke", "John"),
    byBooks("currency-gospels", "biblical-currency", "Name a coin or unit of money mentioned in the four Gospels.", "Daily Life", "Matthew", "Mark", "Luke", "John"),
    byBooks("siblings-gospels", "biblical-sibling", "Name a pair of siblings appearing in the four Gospels.", "People", "Matthew", "Mark", "Luke", "John"),
    byBooks("foods-gospels", "biblical-food", "Name a food mentioned in the four Gospels.", "Daily Life", "Matthew", "Mark", "Luke", "John"),
    byBooks("prisoners-gospels", "nt-prisoner", "Name someone held prisoner in the four Gospels.", "People", "Matthew", "Mark", "Luke", "John"),
    byBooks("prisoners-acts", "nt-prisoner", "Name someone held prisoner in Acts.", "People", "Acts"),
    byBooks("gifts-romans", "spiritual-gift", "Name a spiritual gift listed in Romans 12.", "Teachings", "Romans"),
  ],
  wholeBible: [
    byLabels("farm-animals", "bible-animal", "Name a domesticated farm animal mentioned in the Bible.", "Creation", "Sheep", "Donkey", "Camel", "Ox", "Horse", "Goat", "Calf", "Mule", "Ewe", "Ram"),
    byLabels("biblical-birds", "bible-animal", "Name a bird mentioned in the Bible.", "Creation", "Dove", "Raven", "Eagle", "Rooster", "Ostrich", "Peacock", "Quail", "Sparrow", "Stork", "Owl", "Barn owl", "Black vulture", "Hawk", "Partridge", "Swallow"),
    byLabels("wild-animals", "bible-animal", "Name a wild land animal mentioned in the Bible.", "Creation", "Lion", "Ibex", "Hyrax", "Fox", "Wolf", "Bear", "Deer", "Gazelle", "Hare", "Wild goat", "Wild ox", "Wild donkey", "Boar", "Leopard", "Ape", "Jackal"),
    byLabels("small-creatures", "bible-animal", "Name a small creature or insect mentioned in the Bible.", "Creation", "Locust", "Frog", "Ant", "Moth", "Viper", "Bat", "Scorpion", "Worm"),
    byLabels("biblical-trees", "biblical-plant", "Name a tree mentioned in the Bible.", "Creation", "Fig tree", "Olive tree", "Cedar", "Palm tree", "Almond tree", "Broom tree", "Sycamore fig", "Oak", "Acacia", "Pomegranate", "Apple tree", "Balsam tree", "Cypress", "Pine", "Willow", "Poplar", "Plane tree"),
    byLabels("grains-and-herbs", "biblical-plant", "Name a grain or culinary herb mentioned in the Bible.", "Creation", "Wheat", "Barley", "Flax", "Coriander", "Cumin", "Dill", "Mint", "Rue"),
    byLabels("biblical-spices", "biblical-plant", "Name a spice or fragrant plant mentioned in the Bible.", "Creation", "Aloe", "Myrrh", "Frankincense", "Balm", "Cinnamon", "Cassia", "Calamus", "Nard", "Saffron"),
    byLabels("garden-plants", "biblical-plant", "Name a garden plant or vine mentioned in the Bible.", "Creation", "Grapevine", "Mustard", "Hyssop", "Mandrake", "Apple tree", "Henna", "Saffron", "Nard"),
    byLabels("grains-and-breads", "biblical-food", "Name a grain or bread food mentioned in the Bible.", "Daily Life", "Bread", "Roasted grain", "Manna", "Barley", "Wheat", "Beans", "Cake", "Unleavened bread", "Millet", "Spelt", "Fine flour"),
    byLabels("biblical-fruits-nuts", "biblical-food", "Name a fruit or nut eaten in the Bible.", "Daily Life", "Figs", "Raisins", "Grapes", "Olives", "Dates", "Pomegranates", "Almonds", "Pistachio nuts", "Apples", "Sycamore figs"),
    byLabels("biblical-vegetables", "biblical-food", "Name a vegetable or savory plant eaten in the Bible.", "Daily Life", "Cucumbers", "Melons", "Onions", "Garlic", "Leeks", "Wild gourds", "Bitter herbs"),
    byLabels("animal-foods", "biblical-food", "Name an animal-derived food mentioned in the Bible.", "Daily Life", "Fish", "Quail", "Locusts", "Egg", "Milk", "Curds", "Meat", "Lamb", "Goat", "Venison", "Cheese", "Fattened fowl"),
    byLabels("pantry-foods", "biblical-food", "Name a pantry staple or drink mentioned in the Bible.", "Daily Life", "Honey", "Vinegar", "Coriander seed", "Salt", "Oil", "Wine", "Broth"),
    byLabels("agricultural-work", "bible-occupation", "Name an agricultural occupation represented in the Bible.", "Daily Life", "Shepherd", "Farmer", "Vinedresser", "Gardener", "Hunter"),
    byLabels("craftspeople", "bible-occupation", "Name a craft or trade occupation represented in the Bible.", "Daily Life", "Carpenter", "Tentmaker", "Tanner", "Silversmith", "Potter", "Weaver", "Goldsmith", "Perfumery maker", "Baker", "Blacksmith"),
    byLabels("public-officials", "bible-occupation", "Name a civic or royal occupation represented in the Bible.", "Daily Life", "Cupbearer", "Tax collector", "Scribe", "King", "Judge", "Governor", "Magistrate", "Proconsul", "Steward"),
    byLabels("security-work", "bible-occupation", "Name a military or security occupation represented in the Bible.", "Daily Life", "Soldier", "Charioteer", "Jailer", "Centurion", "Guard", "Doorkeeper", "Herald"),
    byLabels("commerce-work", "bible-occupation", "Name a commercial occupation represented in the Bible.", "Daily Life", "Purple-goods seller", "Trader", "Money changer", "Innkeeper", "Sailor"),
    byLabels("religious-work", "bible-occupation", "Name a religious or musical role represented in the Bible.", "Worship", "Priest", "Prophet", "Musician", "Singer", "Astrologer", "Magician", "Exorcist"),
    byLabels("projectile-weapons", "biblical-weapon", "Name a blade or projectile weapon mentioned in the Bible.", "Objects", "Sword", "Sling", "Spear", "Bow", "Arrow", "Javelin", "Dagger"),
    byLabels("improvised-weapons", "biblical-weapon", "Name an everyday object used as a weapon in the Bible.", "Objects", "Stone", "Whip", "Rod", "Torch", "Millstone", "Razor", "Mattock", "Oxgoad", "Tent peg", "Jawbone", "Hammer"),
    byLabels("siege-equipment", "biblical-weapon", "Name a defensive item or piece of siege equipment mentioned in the Bible.", "Objects", "Shield", "War club", "Siegeworks", "Siege ramp", "War engine", "Club"),
    byLabels("priestly-garments", "biblical-clothing", "Name a priestly garment mentioned in the Bible.", "Objects", "Turban", "Ephod", "Breastpiece", "Linen garment", "Linen undergarments", "Priestly sash"),
    byLabels("ceremonial-clothing", "biblical-clothing", "Name royal or ceremonial clothing mentioned in the Bible.", "Objects", "Robe", "Cloak", "Veil", "Crown", "Wedding garment", "Diadem", "Purple garment", "Scarlet robe"),
    byLabels("everyday-clothing", "biblical-clothing", "Name an everyday garment or covering mentioned in the Bible.", "Objects", "Sandals", "Tunic", "Belt", "Head covering", "Garment", "Seamless tunic", "Swaddling cloths"),
    byLabels("worship-structures", "biblical-structure", "Name a worship structure or sacred place mentioned in the Bible.", "Places", "Temple", "Tabernacle", "Synagogue", "Altar", "Temple of Artemis", "Dagon’s temple", "Solomon’s Colonnade"),
    byLabels("defensive-structures", "biblical-structure", "Name a defensive structure mentioned in the Bible.", "Places", "Jerusalem wall", "City gate", "Watchtower", "Fortress", "Siege tower", "Tower of Siloam", "Tower of Penuel"),
    byLabels("homes-and-rooms", "biblical-structure", "Name a home, palace, or room mentioned in the Bible.", "Places", "Upper room", "Abraham’s tent", "Joseph’s tomb", "Rahab’s house", "David’s palace", "Nebuchadnezzar’s palace", "Solomon’s palace"),
    byLabels("pentateuch-couples", "biblical-couple", "Name a married couple whose story appears in the Pentateuch.", "People", "Adam and Eve", "Abraham and Sarah", "Isaac and Rebekah", "Jacob and Rachel", "Moses and Zipporah", "Jacob and Leah", "Cain and his wife", "Noah and his wife", "Lot and his wife", "Joseph and Asenath", "Amram and Jochebed", "Aaron and Elisheba"),
    byLabels("brother-pairs", "biblical-sibling", "Name a pair of brothers in the Bible.", "People", "Cain and Abel", "Jacob and Esau", "Moses and Aaron", "Peter and Andrew", "James and John", "Nahor and Abraham", "Jubal and Jabal", "Joseph and Benjamin", "Isaac and Ishmael", "Ephraim and Manasseh", "Nadab and Abihu", "Perez and Zerah", "Mahlon and Chilion", "Hophni and Phinehas", "Shem and Ham", "Shem and Japheth", "Ham and Japheth", "Haran and Nahor", "Reuben and Simeon", "Er and Onan", "Abimelech and Jotham", "Amnon and Absalom", "Solomon and Adonijah", "Jesus and James", "Jesus and Jude"),
    byLabels("leaders-who-prayed", "person-who-prayed", "Name a biblical ruler or civic leader who prayed.", "Worship", "David", "Solomon", "Hezekiah", "Manasseh", "Nehemiah", "Ezra", "Asa", "Saul", "Jehoshaphat", "Joshua", "Gideon"),
    byLabels("leaders-who-fasted", "person-who-fasted", "Name a biblical leader who fasted.", "Worship", "Moses", "Esther", "David", "Daniel", "Paul", "Ezra", "Nehemiah", "Elijah", "Ahab", "Darius", "Barnabas"),
  ],
  niche: [
    byBooks("mighty-men-samuel", "david-mighty-man", "Name one of David’s mighty men listed in 2 Samuel 23.", "People", "2 Samuel"),
    byBooks("mighty-men-chronicles", "david-mighty-man", "Name one of David’s mighty men listed in 1 Chronicles 11.", "People", "1 Chronicles"),
    byLabels("esther-eunuchs", "esther-person", "Name one of the seven eunuchs serving Ahasuerus in Esther 1.", "People", "Mehuman", "Biztha", "Harbona", "Bigtha", "Abagtha", "Zethar", "Carkas"),
    byLabels("esther-princes", "esther-person", "Name one of the seven Persian princes in Esther 1.", "People", "Carshena", "Shethar", "Admatha", "Tarshish", "Meres", "Marsena", "Memucan"),
    byLabels("haman-sons", "esther-person", "Name one of Haman’s ten sons in Esther 9.", "People", "Parshandatha", "Dalaphon", "Aspatha", "Poratha", "Adalia", "Aridatha", "Parmashta", "Arisai", "Aridai", "Vaizatha"),
    byLabels("wall-building-groups", "nehemiah-builder", "Name a group identified with repairing Jerusalem’s wall in Nehemiah 3.", "People", "The men of Jericho", "The sons of Hassenaah", "The Tekoites", "The goldsmiths", "The perfumers", "The daughters of Shallum", "The priests from the surrounding area", "The temple servants", "The merchants"),
    byLabels("named-wall-builders", "nehemiah-builder", "Name an individual wall-builder in Nehemiah 3.", "People", "Eliashib", "Shallum", "Meremoth", "Meshullam", "Malchijah", "Hanun", "Joiada", "Melatiah", "Zaccur", "Zadok", "Jadon", "Uzziel", "Hananiah", "Rephaiah", "Jedaiah", "Hattush", "Hasshub", "Rehum", "Hashabiah", "Bavvai", "Ezer", "Baruch", "Binnui", "Palal", "Pedaiah", "Azariah", "Shemaiah"),
    byLabels("solomon-court-officials", "solomon-official", "Name an official in Solomon’s central court in 1 Kings 4.", "Kings", "Benaiah", "Zadok", "Abiathar", "Adoniram", "Azariah son of Zadok", "Elihoreph", "Ahijah son of Shisha", "Azariah son of Nathan", "Zabud", "Ahishar", "Jehoshaphat son of Ahilud"),
    byLabels("solomon-district-officials", "solomon-official", "Name one of Solomon’s twelve district officials in 1 Kings 4.", "Kings", "Ben-hur", "Ben-deker", "Ben-hesed", "Ben-abinadab", "Baana son of Ahilud", "Ben-geber", "Ahinadab", "Ahimaaz", "Baana son of Hushai", "Jehoshaphat son of Paruah", "Shimei son of Ela", "Geber son of Uri"),
    byLabels("romans-sixteen-women", "romans-16-person", "Name a woman greeted or commended in Romans 16.", "Early Church", "Priscilla", "Phoebe", "Junia", "Tryphena", "Persis", "Mary", "Tryphosa", "Julia"),
    byLabels("romans-sixteen-companions", "romans-16-person", "Name one of Paul’s companions sending greetings in Romans 16:21–23.", "Early Church", "Tertius", "Quartus", "Timothy", "Lucius", "Jason", "Sosipater", "Gaius", "Erastus"),
    byLabels("second-timothy-travelers", "second-timothy-greeting", "Name someone Paul says left, was sent, or remained elsewhere in 2 Timothy 4.", "Letters", "Demas", "Crescens", "Titus", "Tychicus", "Erastus", "Trophimus"),
    byLabels("revelation-creatures", "revelation-image", "Name a creature or living figure in Revelation’s visions.", "Visions", "The Lamb", "The dragon", "Four horsemen", "The beast", "Woman clothed with the sun", "Four living creatures", "The male child", "The beast from the sea", "The beast from the earth", "The rider on the white horse"),
    byLabels("revelation-sacred-objects", "revelation-image", "Name a sacred object or heavenly furnishing in Revelation.", "Visions", "Seven lampstands", "Seven stars", "The scroll with seven seals", "Golden bowls of incense", "Seven trumpets", "Ark of the covenant", "Book of life", "The great white throne"),
    byLabels("ezra-persian-officials", "ezra-nehemiah-person", "Name a Persian ruler or official appearing in Ezra.", "People", "Artaxerxes", "Cyrus", "Darius", "Mithredath", "Tattenai", "Shethar-bozenai", "Rehum", "Shimshai"),
    byBooks("aaron-family-exodus", "aaron-family", "Name a member of Aaron’s extended family named in Exodus.", "Worship", "Exodus"),
  ],
};

function spreadSourceFamilies(specs: ScopedQuestionSpec[]) {
  const remaining = [...specs];
  const spread: ScopedQuestionSpec[] = [];
  let previousSource = "";
  while (remaining.length) {
    const differentSource = remaining.findIndex((spec) => spec.sourceId !== previousSource);
    const [next] = remaining.splice(differentSource < 0 ? 0 : differentSource, 1);
    spread.push(next);
    previousSource = next.sourceId;
  }
  return spread;
}

export const SCOPED_QUESTION_SPECS: Record<QuestionPool, ScopedQuestionSpec[]> = {
  oldTestament: spreadSourceFamilies(RAW_SCOPED_QUESTION_SPECS.oldTestament),
  newTestament: spreadSourceFamilies(RAW_SCOPED_QUESTION_SPECS.newTestament),
  wholeBible: spreadSourceFamilies(RAW_SCOPED_QUESTION_SPECS.wholeBible),
  niche: (() => {
    const spread = spreadSourceFamilies(RAW_SCOPED_QUESTION_SPECS.niche);
    return [...spread.slice(1), spread[0]];
  })(),
};

export const SCOPED_QUESTION_IDS = Object.values(SCOPED_QUESTION_SPECS).flat().map((spec) => spec.id);

// Scoped prompts need their own references when an answer appears in several
// books but the master catalog cites only one of them.
export const SCOPED_ANSWER_ADDITIONS: Record<string, readonly ScopedAnswerAddition[]> = {
  "women-exodus": [
    { label: "Pharaoh’s daughter", reference: "Exodus 2:5", aliases: ["Pharaoh's daughter"] },
  ],
  "women-judges": [
    { label: "Achsah", reference: "Judges 1:12–15" },
    { label: "The woman of Thebez", reference: "Judges 9:53", aliases: ["woman at Thebez"] },
    { label: "Sisera’s mother", reference: "Judges 5:28", aliases: ["Sisera's mother"] },
  ],
  "women-first-samuel": [
    { label: "Eli’s daughter-in-law", reference: "1 Samuel 4:19", aliases: ["Eli's daughter in law", "Phinehas's wife"] },
  ],
  "women-second-kings": [
    { label: "Jezebel", reference: "2 Kings 9:30" },
    { label: "The prophet’s widow", reference: "2 Kings 4:1", aliases: ["prophet's widow", "widow with the oil"] },
  ],
  "animals-genesis": [
    { label: "Sheep", reference: "Genesis 4:2" },
    { label: "Lion", reference: "Genesis 49:9" },
    { label: "Donkey", reference: "Genesis 49:14" },
    { label: "Raven", reference: "Genesis 8:7" },
    { label: "Ox", reference: "Genesis 12:16", aliases: ["oxen"] },
    { label: "Horse", reference: "Genesis 47:17" },
    { label: "Goat", reference: "Genesis 27:9" },
    { label: "Calf", reference: "Genesis 18:7" },
  ],
  "animals-exodus": [
    { label: "Sheep", reference: "Exodus 12:5" },
    { label: "Donkey", reference: "Exodus 13:13" },
    { label: "Ox", reference: "Exodus 20:17", aliases: ["oxen"] },
    { label: "Horse", reference: "Exodus 14:9" },
    { label: "Goat", reference: "Exodus 12:5" },
    { label: "Eagle", reference: "Exodus 19:4" },
    { label: "Serpent", reference: "Exodus 7:9", aliases: ["snake"] },
    { label: "Fish", reference: "Exodus 7:18" },
    { label: "Dog", reference: "Exodus 11:7" },
  ],
  "animals-leviticus": [
    { label: "Camel", reference: "Leviticus 11:4" },
    { label: "Hyrax", reference: "Leviticus 11:5", aliases: ["rock badger"] },
    { label: "Eagle", reference: "Leviticus 11:13" },
    { label: "Raven", reference: "Leviticus 11:15" },
    { label: "Ostrich", reference: "Leviticus 11:16" },
    { label: "Hawk", reference: "Leviticus 11:16" },
    { label: "Owl", reference: "Leviticus 11:17" },
    { label: "Locust", reference: "Leviticus 11:22" },
    { label: "Pig", reference: "Leviticus 11:7", aliases: ["swine"] },
  ],
  "animals-job": [
    { label: "Lion", reference: "Job 4:10" },
    { label: "Raven", reference: "Job 38:41" },
    { label: "Eagle", reference: "Job 39:27" },
    { label: "Horse", reference: "Job 39:19" },
    { label: "Ox", reference: "Job 6:5", aliases: ["oxen"] },
    { label: "Donkey", reference: "Job 6:5" },
    { label: "Jackal", reference: "Job 30:29" },
  ],
  "animals-psalms": [
    { label: "Lion", reference: "Psalm 22:13" },
    { label: "Eagle", reference: "Psalm 103:5" },
    { label: "Dog", reference: "Psalm 22:16" },
    { label: "Ox", reference: "Psalm 8:7", aliases: ["oxen"] },
    { label: "Horse", reference: "Psalm 33:17" },
    { label: "Goat", reference: "Psalm 104:18" },
    { label: "Raven", reference: "Psalm 147:9" },
    { label: "Jackal", reference: "Psalm 44:19" },
    { label: "Serpent", reference: "Psalm 58:4", aliases: ["snake"] },
    { label: "Fish", reference: "Psalm 8:8" },
    { label: "Bird", reference: "Psalm 50:11" },
  ],
  "animals-proverbs": [
    { label: "Eagle", reference: "Proverbs 30:17" },
    { label: "Raven", reference: "Proverbs 30:17" },
    { label: "Serpent", reference: "Proverbs 30:19", aliases: ["snake"] },
    { label: "Locust", reference: "Proverbs 30:27" },
    { label: "Lizard", reference: "Proverbs 30:28" },
    { label: "Rooster", reference: "Proverbs 30:31", aliases: ["cock"] },
    { label: "Goat", reference: "Proverbs 30:31" },
    { label: "Sheep", reference: "Proverbs 27:23" },
    { label: "Bird", reference: "Proverbs 1:17" },
  ],
  "occupations-pentateuch": [
    { label: "Shepherd", reference: "Genesis 4:2", aliases: ["keeper of sheep"] },
    { label: "Farmer", reference: "Genesis 4:2", aliases: ["worker of the ground", "tiller of the ground"] },
    { label: "King", reference: "Genesis 14:1" },
    { label: "Prophet", reference: "Genesis 20:7" },
    { label: "Cupbearer", reference: "Genesis 40:1", aliases: ["chief cupbearer"] },
  ],
  craftspeople: [
    { label: "Engraver", reference: "Exodus 35:35" },
    { label: "Embroiderer", reference: "Exodus 35:35" },
    { label: "Mason", reference: "2 Samuel 5:11", aliases: ["stone mason", "stonemason"] },
    { label: "Metalworker", reference: "Genesis 4:22", aliases: ["worker of bronze and iron"] },
  ],
  "occupations-prophets": [
    { label: "Shepherd", reference: "Amos 1:1" },
    { label: "Farmer", reference: "Amos 5:16" },
    { label: "Priest", reference: "Jeremiah 20:1" },
    { label: "Prophet", reference: "Isaiah 37:2" },
    { label: "King", reference: "Isaiah 6:1" },
    { label: "Scribe", reference: "Jeremiah 36:10" },
  ],
  "prophets-kings": [
    { label: "Isaiah", reference: "2 Kings 19:2" },
    { label: "Nathan", reference: "1 Kings 1:8" },
    { label: "Shemaiah", reference: "1 Kings 12:22" },
  ],
  "prophets-chronicles": [
    { label: "Isaiah", reference: "2 Chronicles 26:22" },
    { label: "Jeremiah", reference: "2 Chronicles 35:25" },
    { label: "Nathan", reference: "1 Chronicles 29:29" },
    { label: "Gad", reference: "1 Chronicles 29:29" },
    { label: "Ahijah", reference: "2 Chronicles 9:29" },
    { label: "Shemaiah", reference: "2 Chronicles 12:5" },
    { label: "Iddo", reference: "2 Chronicles 12:15" },
    { label: "Azariah son of Oded", reference: "2 Chronicles 15:1", aliases: ["Azariah", "Azariah the son of Oded"] },
  ],
  "nativity-matthew": [
    { label: "Mary", reference: "Matthew 1:18", aliases: ["Mary mother of Jesus", "Virgin Mary"] },
  ],
  "women-matthew": [
    { label: "Mary Magdalene", reference: "Matthew 27:56" },
    { label: "Mary the mother of James", reference: "Matthew 27:56", aliases: ["mother of James"] },
    { label: "Herodias", reference: "Matthew 14:3" },
    { label: "The daughter of Herodias", reference: "Matthew 14:6", aliases: ["Herodias's daughter"] },
    { label: "The Canaanite woman", reference: "Matthew 15:22" },
    { label: "The bleeding woman", reference: "Matthew 9:20", aliases: ["woman with the flow of blood"] },
  ],
  "prophets-acts": [
    { label: "Moses", reference: "Acts 3:22" },
    { label: "Samuel", reference: "Acts 3:24" },
    { label: "Joel", reference: "Acts 2:16" },
    { label: "David", reference: "Acts 2:30" },
    { label: "Isaiah", reference: "Acts 8:28" },
  ],
  "resurrection-matthew": [
    { label: "Mary Magdalene", reference: "Matthew 28:1" },
    { label: "The guards", reference: "Matthew 28:4", aliases: ["guards", "Roman guards", "tomb guards"] },
  ],
  "companions-first-corinthians": [
    { label: "Timothy", reference: "1 Corinthians 4:17" },
    { label: "Priscilla", reference: "1 Corinthians 16:19", aliases: ["Prisca"] },
    { label: "Aquila", reference: "1 Corinthians 16:19" },
    { label: "Peter", reference: "1 Corinthians 1:12", aliases: ["Cephas"] },
  ],
  "companions-colossians": [
    { label: "Timothy", reference: "Colossians 1:1" },
    { label: "Tychicus", reference: "Colossians 4:7" },
    { label: "Aristarchus", reference: "Colossians 4:10" },
    { label: "Mark", reference: "Colossians 4:10", aliases: ["John Mark"] },
    { label: "Luke", reference: "Colossians 4:14" },
  ],
  "plants-matthew": [
    { label: "Fig tree", reference: "Matthew 21:19", aliases: ["fig"] },
    { label: "Thorn", reference: "Matthew 13:7", aliases: ["thorns"] },
    { label: "Grass", reference: "Matthew 6:30" },
    { label: "Cumin", reference: "Matthew 23:23" },
    { label: "Grapevine", reference: "Matthew 21:33", aliases: ["vine", "grape vine"] },
  ],
  "animals-matthew": [
    { label: "Sheep", reference: "Matthew 25:32" },
    { label: "Donkey", reference: "Matthew 21:2" },
    { label: "Camel", reference: "Matthew 19:24" },
    { label: "Serpent", reference: "Matthew 10:16", aliases: ["snake"] },
    { label: "Fish", reference: "Matthew 7:10" },
    { label: "Dog", reference: "Matthew 7:6" },
    { label: "Fox", reference: "Matthew 8:20" },
    { label: "Bird", reference: "Matthew 6:26" },
  ],
  "structures-gospels": [
    { label: "Temple", reference: "Matthew 21:12" },
    { label: "Altar", reference: "Matthew 23:35" },
    { label: "Upper room", reference: "Mark 14:15" },
    { label: "Joseph’s tomb", reference: "Matthew 27:60", aliases: ["Joseph's tomb", "Jesus's tomb", "Jesus' tomb"] },
    { label: "City gate", reference: "Luke 7:12" },
  ],
  "foods-gospels": [
    { label: "Wine", reference: "Luke 22:18" },
    { label: "Vinegar", reference: "Matthew 27:48", aliases: ["sour wine"] },
    { label: "Salt", reference: "Matthew 5:13" },
  ],
};

export const SCOPED_NATURAL_ALIASES: Record<string, readonly string[]> = {
  "The witch of Endor": ["medium of Endor", "Endor medium"],
  "The eleven disciples": ["eleven disciples", "11 disciples"],
  "The women at the tomb": ["women at tomb"],
  "The disciples in Galilee": ["Galilee disciples"],
  "Purple-goods seller": ["seller of purple", "purple seller"],
  "Perfumery maker": ["perfume maker", "perfumer"],
  Cucumbers: ["cucumber"],
  Melons: ["melon"],
  Onions: ["onion"],
  "Wild gourds": ["wild gourd", "gourds", "gourd"],
  Leeks: ["leek"],
  "Bitter herbs": ["bitter herb", "herbs"],
  Figs: ["fig"],
  Raisins: ["raisin"],
  Grapes: ["grape"],
  Olives: ["olive"],
  Dates: ["date"],
  Pomegranates: ["pomegranate"],
  Almonds: ["almond"],
  Apples: ["apple"],
  "Sycamore figs": ["sycamore fig"],
  Locusts: ["locust"],
  Beans: ["bean"],
  Sandals: ["sandal"],
  "Baana son of Ahilud": ["Baana Ahilud", "Baana of Ahilud"],
  "Baana son of Hushai": ["Baana Hushai", "Baana of Hushai"],
  "Jehoshaphat son of Paruah": ["Jehoshaphat Paruah"],
  "Shimei son of Ela": ["Shimei Ela"],
  "Geber son of Uri": ["Geber Uri"],
  "Azariah son of Nathan": ["Azariah Nathan"],
  "Jehoshaphat son of Ahilud": ["Jehoshaphat Ahilud"],
  "The scroll with seven seals": ["seven seal scroll", "seven sealed scroll"],
  "Golden bowls of incense": ["incense bowls", "golden bowls"],
};
