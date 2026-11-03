import { build2027Calendar } from "./calendar-2027";
import { YEAR_QUESTIONS, YEAR_QUESTION_POOLS } from "./year-questions";

export const TIERS = {
  ink: { label: "Mustard Seed", points: 100, symbol: "●" },
  bronze: { label: "Manna", points: 250, symbol: "◆" },
  silver: { label: "Miracle", points: 450, symbol: "✦" },
  gold: { label: "Transfiguration", points: 700, symbol: "✹" },
  pearl: { label: "Seventh Seal", points: 1000, symbol: "◉" },
} as const;

export type Tier = keyof typeof TIERS;

export type AcceptedAnswer = {
  id: string;
  label: string;
  tier: Tier;
  reference: string;
  note: string;
  aliases?: string[];
};

export type Question = {
  id: string;
  prompt: string;
  category: string;
  answers: AcceptedAnswer[];
};

export type DailyScroll = {
  id: string;
  dateKey: string;
  title: string;
  subtitle: string;
  deepQuestionId: string;
  questionIds: string[];
};

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const answer = (
  label: string,
  tier: Tier,
  reference: string,
  note: string,
  aliases: string[] = [],
): AcceptedAnswer => ({ id: slug(label), label, tier, reference, note, aliases });

const q = (id: string, prompt: string, category: string, answers: AcceptedAnswer[]): Question => ({
  id,
  prompt,
  category,
  answers,
});

const CORE_QUESTIONS: Question[] = [
  q("apostle", "Name one of Jesus’ twelve apostles.", "People", [
    answer("Peter", "ink", "Matthew 10:2", "Peter is named first in Matthew’s list of the twelve.", ["Simon Peter", "Simon"]),
    answer("John", "ink", "Matthew 10:2", "John, the brother of James, was one of the twelve."),
    answer("James", "bronze", "Matthew 10:2–3", "Two apostles named James appear in the list.", ["James son of Zebedee", "James son of Alphaeus"]),
    answer("Andrew", "bronze", "Matthew 10:2", "Andrew was Peter’s brother and one of the twelve."),
    answer("Thomas", "silver", "Matthew 10:3", "Thomas is included among the twelve apostles.", ["Didymus"]),
    answer("Matthew", "silver", "Matthew 10:3", "Matthew the tax collector was one of the twelve.", ["Levi"]),
    answer("Philip", "gold", "Matthew 10:3", "Philip is named in every New Testament list of the twelve."),
    answer("Bartholomew", "gold", "Matthew 10:3", "Bartholomew is listed with the twelve.", ["Nathanael"]),
    answer("Thaddaeus", "pearl", "Matthew 10:3", "Thaddaeus is named among the twelve.", ["Judas son of James", "Jude"]),
    answer("Simon the Zealot", "pearl", "Matthew 10:4", "Simon the Zealot is distinguished from Simon Peter.", ["Simon the Cananaean"]),
    answer("Judas Iscariot", "pearl", "Matthew 10:4", "Judas Iscariot is included in Matthew’s list of the twelve.", ["Iscariot"]),
  ]),
  q("jacob-son", "Name one of Jacob’s sons.", "People", [
    answer("Joseph", "ink", "Genesis 30:24", "Rachel named Jacob’s son Joseph."),
    answer("Judah", "ink", "Genesis 29:35", "Leah named her fourth son Judah."),
    answer("Benjamin", "bronze", "Genesis 35:18", "Jacob named Rachel’s younger son Benjamin."),
    answer("Reuben", "bronze", "Genesis 29:32", "Reuben was Jacob’s firstborn."),
    answer("Levi", "silver", "Genesis 29:34", "Levi was a son of Jacob and Leah."),
    answer("Simeon", "silver", "Genesis 29:33", "Simeon was Jacob and Leah’s second son."),
    answer("Dan", "gold", "Genesis 30:6", "Dan was Jacob’s son through Bilhah."),
    answer("Gad", "gold", "Genesis 30:11", "Gad was Jacob’s son through Zilpah."),
    answer("Naphtali", "pearl", "Genesis 30:8", "Naphtali was Jacob’s son through Bilhah."),
    answer("Issachar", "pearl", "Genesis 30:18", "Issachar was a son of Jacob and Leah."),
    answer("Zebulun", "pearl", "Genesis 30:20", "Zebulun was a son of Jacob and Leah."),
    answer("Asher", "pearl", "Genesis 30:13", "Asher was Jacob’s son through Zilpah."),
  ]),
  q("judge", "Name a judge of Israel.", "People", [
    answer("Samson", "ink", "Judges 13–16", "Samson judged Israel for twenty years."),
    answer("Deborah", "ink", "Judges 4:4", "Deborah was a prophetess who was judging Israel."),
    answer("Gideon", "bronze", "Judges 6–8", "Gideon delivered Israel from Midian."),
    answer("Samuel", "bronze", "1 Samuel 7:15", "Samuel judged Israel all the days of his life."),
    answer("Jephthah", "silver", "Judges 11–12", "Jephthah led Israel against the Ammonites."),
    answer("Othniel", "silver", "Judges 3:9–11", "Othniel is the first judge described in Judges."),
    answer("Ehud", "gold", "Judges 3:15–30", "Ehud delivered Israel from Eglon of Moab."),
    answer("Shamgar", "gold", "Judges 3:31", "Shamgar struck down six hundred Philistines."),
    answer("Tola", "pearl", "Judges 10:1–2", "Tola judged Israel for twenty-three years."),
    answer("Ibzan", "pearl", "Judges 12:8–10", "Ibzan of Bethlehem judged Israel for seven years."),
    answer("Elon", "pearl", "Judges 12:11–12", "Elon the Zebulunite judged Israel for ten years."),
    answer("Abdon", "pearl", "Judges 12:13–15", "Abdon son of Hillel judged Israel for eight years."),
    answer("Jair", "pearl", "Judges 10:3–5", "Jair judged Israel for twenty-two years."),
  ]),
  q("judah-king", "Name a king of Judah.", "Kings", [
    answer("David", "ink", "2 Samuel 5:5", "David ruled Judah and then all Israel."),
    answer("Solomon", "ink", "1 Kings 1:39", "Solomon succeeded David as king."),
    answer("Hezekiah", "bronze", "2 Kings 18:1", "Hezekiah became king of Judah in the third year of Hoshea."),
    answer("Josiah", "bronze", "2 Kings 22:1", "Josiah reigned thirty-one years in Jerusalem."),
    answer("Rehoboam", "silver", "1 Kings 14:21", "Rehoboam reigned in Judah after the kingdom divided."),
    answer("Jehoshaphat", "silver", "1 Kings 22:41–42", "Jehoshaphat reigned twenty-five years in Jerusalem."),
    answer("Uzziah", "gold", "2 Chronicles 26:1–3", "Uzziah became king of Judah at sixteen.", ["Azariah"]),
    answer("Manasseh", "gold", "2 Kings 21:1", "Manasseh reigned fifty-five years in Jerusalem."),
    answer("Jotham", "pearl", "2 Kings 15:32–33", "Jotham reigned sixteen years in Jerusalem."),
    answer("Jehoahaz", "pearl", "2 Kings 23:31", "Jehoahaz reigned three months in Jerusalem."),
    answer("Abijah", "bronze", "1 Kings 15:1", "Abijah reigned over Judah after Rehoboam.", ["Abijam"]),
    answer("Asa", "bronze", "1 Kings 15:9", "Asa reigned over Judah for forty-one years."),
    answer("Jehoram", "silver", "2 Kings 8:16", "Jehoram son of Jehoshaphat reigned over Judah.", ["Joram of Judah"]),
    answer("Ahaziah", "silver", "2 Kings 8:25", "Ahaziah son of Jehoram reigned over Judah."),
    answer("Joash", "gold", "2 Kings 12:1", "Joash began to reign over Judah at seven years old.", ["Jehoash of Judah"]),
    answer("Amaziah", "gold", "2 Kings 14:1", "Amaziah son of Joash reigned over Judah."),
    answer("Ahaz", "gold", "2 Kings 16:1", "Ahaz son of Jotham reigned over Judah."),
    answer("Amon", "pearl", "2 Kings 21:19", "Amon son of Manasseh reigned over Judah."),
    answer("Jehoiakim", "pearl", "2 Kings 23:36", "Jehoiakim reigned eleven years in Jerusalem."),
    answer("Jehoiachin", "pearl", "2 Kings 24:8", "Jehoiachin reigned three months in Jerusalem.", ["Jeconiah", "Coniah"]),
    answer("Zedekiah", "pearl", "2 Kings 24:18", "Zedekiah was Judah’s final king before Jerusalem fell."),
  ]),
  q("paul-city", "Name a city Paul visited.", "Places", [
    answer("Rome", "ink", "Acts 28:16", "Paul reached Rome under guard."),
    answer("Jerusalem", "ink", "Acts 21:17", "Paul and his companions arrived in Jerusalem."),
    answer("Corinth", "bronze", "Acts 18:1", "Paul left Athens and went to Corinth."),
    answer("Athens", "bronze", "Acts 17:16", "Paul waited for his companions in Athens."),
    answer("Ephesus", "silver", "Acts 19:1", "Paul came to Ephesus and found disciples there."),
    answer("Philippi", "silver", "Acts 16:12", "Paul stayed in Philippi, a leading city of Macedonia."),
    answer("Thessalonica", "gold", "Acts 17:1", "Paul came to Thessalonica, where there was a synagogue."),
    answer("Lystra", "gold", "Acts 14:8", "Paul ministered in Lystra and healed a man."),
    answer("Troas", "pearl", "Acts 16:8", "Paul and his companions went down to Troas."),
    answer("Miletus", "pearl", "Acts 20:15–17", "Paul summoned the Ephesian elders at Miletus."),
  ]),
  q("ot-woman", "Name a woman in the Old Testament.", "People", [
    answer("Eve", "ink", "Genesis 3:20", "Adam named his wife Eve."),
    answer("Sarah", "ink", "Genesis 17:15", "God changed Sarai’s name to Sarah.", ["Sarai"]),
    answer("Ruth", "bronze", "Ruth 1:16", "Ruth pledged to remain with Naomi."),
    answer("Esther", "bronze", "Esther 2:17", "Esther became queen in place of Vashti."),
    answer("Deborah", "silver", "Judges 4:4", "Deborah was a prophetess and judge."),
    answer("Abigail", "silver", "1 Samuel 25:3", "Abigail is described as discerning and beautiful."),
    answer("Huldah", "gold", "2 Kings 22:14", "Huldah was a prophetess in Jerusalem."),
    answer("Jael", "gold", "Judges 4:21", "Jael defeated Sisera in her tent."),
    answer("Rizpah", "pearl", "2 Samuel 3:7", "Rizpah was a daughter of Aiah."),
    answer("Jehosheba", "pearl", "2 Kings 11:2", "Jehosheba hid Joash from Athaliah.", ["Jehoshabeath"]),
  ]),
  q("bible-animal", "Name an animal mentioned in the Bible.", "Creation", [
    answer("Sheep", "ink", "Psalm 23:1–2", "Sheep appear throughout Scripture."),
    answer("Lion", "ink", "Proverbs 30:30", "The lion is described as mighty among beasts."),
    answer("Donkey", "bronze", "Numbers 22:28", "The Lord opened the mouth of Balaam’s donkey."),
    answer("Dove", "bronze", "Genesis 8:8", "Noah sent out a dove after the flood."),
    answer("Camel", "silver", "Genesis 24:10", "Abraham’s servant took ten camels on his journey."),
    answer("Raven", "silver", "1 Kings 17:4", "Ravens brought Elijah food."),
    answer("Ibex", "gold", "Job 39:1", "Job mentions the mountain goats, rendered ibex in some translations.", ["mountain goat"]),
    answer("Hyrax", "gold", "Proverbs 30:26", "Hyraxes are small but make their homes in the cliffs.", ["rock badger"]),
    answer("Hoopoe", "pearl", "Leviticus 11:19", "The hoopoe appears in the list of unclean birds."),
    answer("Behemoth", "pearl", "Job 40:15", "Behemoth is described in God’s response to Job."),
  ]),
  q("jesus-miracle", "Name a miracle performed by Jesus.", "Signs", [
    answer("Feeding the five thousand", "ink", "Matthew 14:13–21", "Jesus fed five thousand men with five loaves and two fish.", ["fed 5000", "feeding 5000"]),
    answer("Walking on water", "ink", "Matthew 14:22–33", "Jesus walked to the disciples on the sea."),
    answer("Giving sight to the blind", "ink", "Matthew 9:27–31", "Jesus restored sight on more than one occasion.", ["healing the blind", "healed the blind", "healing a blind man", "healed a blind man", "restoring sight", "made the blind see"]),
    answer("Healing a leper", "ink", "Mark 1:40–45", "Jesus touched and cleansed a man with leprosy.", ["cleansing a leper", "healed leper"]),
    answer("Water into wine", "bronze", "John 2:1–11", "Jesus turned water into wine at Cana.", ["water", "turned water into wine", "turning water into wine", "wine at Cana", "Cana"]),
    answer("Calming the storm", "bronze", "Mark 4:35–41", "Jesus rebuked the wind and calmed the sea."),
    answer("Miraculous catch of fish", "bronze", "Luke 5:1–11", "At Jesus’ word, the fishermen enclosed a great number of fish.", ["catch of fish", "catching fish", "boat full of fish"]),
    answer("Raising Jairus’s daughter", "bronze", "Mark 5:21–43", "Jesus took Jairus’s daughter by the hand and raised her.", ["Jairus daughter", "raised Jairus daughter"]),
    answer("Raising Lazarus", "silver", "John 11:38–44", "Jesus called Lazarus out of the tomb."),
    answer("Healing the paralytic", "silver", "Mark 2:1–12", "Jesus healed a paralytic lowered through a roof."),
    answer("Healing the man born blind", "silver", "John 9:1–41", "Jesus gave sight to a man who had been blind from birth.", ["man born blind", "blind man at Siloam", "mud on blind man eyes"]),
    answer("Cleansing ten lepers", "silver", "Luke 17:11–19", "Jesus cleansed ten men with leprosy; one returned to give thanks.", ["ten lepers", "healed 10 lepers"]),
    answer("Healing Bartimaeus", "gold", "Mark 10:46–52", "Jesus restored Bartimaeus’s sight."),
    answer("Healing the centurion’s servant", "gold", "Matthew 8:5–13", "Jesus healed the servant from a distance."),
    answer("Healing Peter’s mother-in-law", "gold", "Mark 1:29–31", "Jesus took her by the hand and the fever left her.", ["Peter mother in law", "healed Peters mother"]),
    answer("Withering the fig tree", "gold", "Mark 11:12–21", "The fig tree Jesus addressed withered from its roots.", ["cursing the fig tree", "fig tree withered"]),
    answer("Healing Malchus’s ear", "pearl", "Luke 22:50–51", "Jesus healed the servant’s ear at his arrest."),
    answer("Coin in the fish’s mouth", "pearl", "Matthew 17:24–27", "Jesus directed Peter to find a coin in a fish."),
    answer("Raising the widow’s son at Nain", "pearl", "Luke 7:11–17", "Jesus raised a widow’s only son outside the town of Nain.", ["widow son at Nain", "raised widow son"]),
    answer("Healing a deaf man", "pearl", "Mark 7:31–37", "Jesus opened the ears of a man who was deaf and had a speech impediment.", ["deaf and mute man", "healing the deaf", "Ephphatha"]),
  ]),
  q("parable", "Name a parable told by Jesus.", "Teachings", [
    answer("The Good Samaritan", "ink", "Luke 10:25–37", "Jesus told of a Samaritan who showed mercy."),
    answer("The Prodigal Son", "ink", "Luke 15:11–32", "A father welcomed home his lost son.", ["lost son"]),
    answer("The Sower", "ink", "Matthew 13:1–23", "Seed fell on four kinds of ground.", ["sower", "parable of the sower", "seed and soil", "four soils"]),
    answer("The Lost Sheep", "ink", "Luke 15:3–7", "A shepherd sought one lost sheep.", ["lost sheep"]),
    answer("The Mustard Seed", "ink", "Matthew 13:31–32", "The kingdom of heaven is compared to a mustard seed.", ["mustard seed"]),
    answer("The Talents", "ink", "Matthew 25:14–30", "Servants were entrusted with differing amounts.", ["talents"]),
    answer("The Ten Virgins", "bronze", "Matthew 25:1–13", "Ten virgins waited for the bridegroom.", ["ten virgins", "wise and foolish virgins"]),
    answer("The Lost Coin", "bronze", "Luke 15:8–10", "A woman searched carefully until she found her lost coin.", ["lost coin"]),
    answer("The Wise and Foolish Builders", "bronze", "Matthew 7:24–27", "One house stood on rock and another fell on sand.", ["wise builder", "foolish builder", "house on the rock", "house on sand"]),
    answer("The Rich Fool", "bronze", "Luke 12:16–21", "A rich man stored up crops but was not rich toward God.", ["rich fool"]),
    answer("The Unforgiving Servant", "bronze", "Matthew 18:23–35", "A forgiven servant refused mercy to another.", ["unmerciful servant"]),
    answer("The Wedding Feast", "bronze", "Matthew 22:1–14", "A king invited guests to his son’s wedding feast.", ["wedding banquet", "great banquet", "great supper"]),
    answer("The Weeds", "silver", "Matthew 13:24–30", "An enemy sowed weeds among good wheat.", ["weeds among the wheat", "wheat and tares", "tares"]),
    answer("The Laborers in the Vineyard", "silver", "Matthew 20:1–16", "Workers hired at different hours received the same wage.", ["workers in the vineyard", "laborers vineyard"]),
    answer("The Wicked Tenants", "silver", "Matthew 21:33–44", "Tenants rejected the landowner’s servants and son.", ["tenants", "wicked tenants", "evil tenants"]),
    answer("The Two Sons", "silver", "Matthew 21:28–32", "Two sons answered their father differently and only one obeyed.", ["two sons"]),
    answer("The Pharisee and the Tax Collector", "silver", "Luke 18:9–14", "A Pharisee and a tax collector prayed very differently.", ["pharisee and publican", "tax collector prayer"]),
    answer("The Persistent Widow", "silver", "Luke 18:1–8", "A widow persistently sought justice.", ["persistent widow", "unjust judge"]),
    answer("The Hidden Treasure", "gold", "Matthew 13:44", "A man joyfully sold everything to buy a field with treasure.", ["treasure in the field", "hidden treasure"]),
    answer("The Pearl of Great Value", "gold", "Matthew 13:45–46", "A merchant sold everything for one precious pearl.", ["pearl of great price", "precious pearl"]),
    answer("The Leaven", "gold", "Matthew 13:33", "Leaven worked through three measures of flour.", ["leaven", "yeast"]),
    answer("The Net", "gold", "Matthew 13:47–50", "A net gathered fish of every kind before they were sorted.", ["dragnet", "fishing net"]),
    answer("The Dishonest Manager", "gold", "Luke 16:1–13", "A manager acted shrewdly before losing his position.", ["unjust steward", "shrewd manager"]),
    answer("The Rich Man and Lazarus", "gold", "Luke 16:19–31", "A rich man and poor Lazarus experienced a great reversal.", ["rich man and Lazarus", "Dives and Lazarus"]),
    answer("The Barren Fig Tree", "pearl", "Luke 13:6–9", "A gardener asked for another year for the fig tree.", ["barren fig tree"]),
    answer("The Growing Seed", "pearl", "Mark 4:26–29", "Seed grew secretly until the harvest.", ["seed growing secretly", "growing seed"]),
    answer("The Two Debtors", "pearl", "Luke 7:41–43", "A moneylender forgave two debtors who owed different amounts.", ["two debtors"]),
    answer("The Friend at Midnight", "pearl", "Luke 11:5–8", "A persistent friend asked for bread at midnight.", ["friend at midnight", "midnight friend"]),
    answer("The Watchful Servants", "pearl", "Luke 12:35–40", "Servants remained ready for their master’s return.", ["watchful servants", "waiting servants"]),
    answer("The Faithful and Wise Servant", "pearl", "Matthew 24:45–51", "A faithful servant remained responsible while the master was away.", ["faithful servant", "wise servant"]),
  ]),
  q("prophet", "Name a prophet in the Bible.", "Prophets", [
    answer("Moses", "ink", "Deuteronomy 34:10", "No prophet like Moses had arisen in Israel."),
    answer("Elijah", "ink", "1 Kings 18:36", "Elijah prayed on Mount Carmel."),
    answer("Isaiah", "bronze", "Isaiah 1:1", "Isaiah received visions concerning Judah and Jerusalem."),
    answer("Jeremiah", "bronze", "Jeremiah 1:5", "God appointed Jeremiah a prophet to the nations."),
    answer("Samuel", "silver", "1 Samuel 3:20", "Israel knew Samuel was established as a prophet."),
    answer("Nathan", "silver", "2 Samuel 12:1", "The Lord sent Nathan to confront David."),
    answer("Micaiah", "gold", "1 Kings 22:8", "Micaiah son of Imlah spoke before Ahab."),
    answer("Agabus", "gold", "Acts 11:28", "Agabus predicted a severe famine."),
    answer("Iddo", "pearl", "2 Chronicles 13:22", "Iddo the prophet recorded acts of Abijah."),
    answer("Shemaiah", "pearl", "2 Chronicles 12:5", "Shemaiah delivered the word of the Lord to Rehoboam."),
  ]),
  q("paul-companion", "Name someone who traveled or ministered with Paul.", "Early Church", [
    answer("Barnabas", "ink", "Acts 13:2–3", "Barnabas and Saul were sent out together."),
    answer("Silas", "ink", "Acts 15:40", "Paul chose Silas for his journey."),
    answer("Timothy", "bronze", "Acts 16:1–3", "Timothy joined Paul and Silas."),
    answer("Luke", "bronze", "Acts 16:10", "The first-person account indicates Luke joined the company."),
    answer("Titus", "silver", "Galatians 2:1", "Paul went to Jerusalem with Barnabas and Titus."),
    answer("Priscilla", "silver", "Acts 18:18", "Priscilla and Aquila sailed with Paul."),
    answer("Aquila", "gold", "Acts 18:18", "Aquila accompanied Paul from Corinth."),
    answer("Epaphroditus", "gold", "Philippians 2:25", "Paul calls Epaphroditus his fellow worker and soldier."),
    answer("Trophimus", "pearl", "Acts 20:4", "Trophimus of Asia accompanied Paul."),
    answer("Aristarchus", "pearl", "Acts 27:2", "Aristarchus traveled with Paul toward Rome."),
  ]),
  q("mountain", "Name a mountain mentioned in the Bible.", "Places", [
    answer("Mount Sinai", "ink", "Exodus 19:20", "The Lord descended on Mount Sinai.", ["Sinai"]),
    answer("Mount of Olives", "ink", "Matthew 24:3", "Jesus taught his disciples on the Mount of Olives.", ["Olivet"]),
    answer("Mount Carmel", "bronze", "1 Kings 18:19", "Elijah confronted the prophets of Baal at Carmel.", ["Carmel"]),
    answer("Mount Ararat", "bronze", "Genesis 8:4", "The ark rested on the mountains of Ararat.", ["Ararat"]),
    answer("Mount Zion", "silver", "Psalm 48:2", "Mount Zion is called the city of the great King.", ["Zion"]),
    answer("Mount Nebo", "silver", "Deuteronomy 34:1", "Moses went up Mount Nebo to view the land.", ["Nebo"]),
    answer("Mount Tabor", "gold", "Judges 4:6", "Barak gathered forces at Mount Tabor.", ["Tabor"]),
    answer("Mount Gerizim", "gold", "Deuteronomy 11:29", "The blessing was set on Mount Gerizim.", ["Gerizim"]),
    answer("Mount Ebal", "pearl", "Deuteronomy 11:29", "The curse was set on Mount Ebal.", ["Ebal"]),
    answer("Mount Hor", "pearl", "Numbers 20:27–28", "Aaron died on Mount Hor.", ["Hor"]),
  ]),
  q("dreamer", "Name someone in the Bible who had a dream or vision.", "Visions", [
    answer("Joseph", "ink", "Genesis 37:5", "Joseph dreamed that his brothers’ sheaves bowed to his."),
    answer("Daniel", "ink", "Daniel 7:1", "Daniel saw visions in his mind as he lay in bed."),
    answer("Jacob", "bronze", "Genesis 28:12", "Jacob dreamed of a ladder reaching to heaven."),
    answer("Nebuchadnezzar", "bronze", "Daniel 2:1", "Nebuchadnezzar had troubling dreams."),
    answer("Peter", "silver", "Acts 10:10–16", "Peter saw a vision of a sheet descending."),
    answer("Paul", "silver", "Acts 16:9", "Paul saw a Macedonian man in a vision."),
    answer("Solomon", "gold", "1 Kings 3:5", "The Lord appeared to Solomon in a dream at Gibeon."),
    answer("Joseph, husband of Mary", "gold", "Matthew 1:20", "An angel appeared to Joseph in a dream.", ["Joseph of Nazareth"]),
    answer("Abimelech", "pearl", "Genesis 20:3", "God came to Abimelech in a dream."),
    answer("Pilate’s wife", "pearl", "Matthew 27:19", "Pilate’s wife suffered because of a dream about Jesus.", ["Claudia"]),
  ]),
  q("river", "Name a river mentioned in the Bible.", "Places", [
    answer("Jordan", "ink", "Joshua 3:17", "Israel crossed the Jordan on dry ground."),
    answer("Nile", "ink", "Exodus 2:3", "Moses’ basket was placed among reeds by the Nile."),
    answer("Euphrates", "bronze", "Genesis 2:14", "The Euphrates is one of the rivers named in Genesis."),
    answer("Tigris", "silver", "Genesis 2:14", "The Tigris flowed east of Assyria.", ["Hiddekel"]),
    answer("Chebar", "gold", "Ezekiel 1:1", "Ezekiel received visions by the Chebar canal.", ["Kebar", "Chebar canal"]),
    answer("Abana", "pearl", "2 Kings 5:12", "Naaman named the Abana among the rivers of Damascus."),
    answer("Pharpar", "pearl", "2 Kings 5:12", "Naaman named the Pharpar among the rivers of Damascus."),
    answer("Kishon", "gold", "Judges 5:21", "The torrent Kishon swept away Sisera’s forces."),
    answer("Jabbok", "gold", "Genesis 32:22", "Jacob crossed the ford of the Jabbok before wrestling through the night."),
    answer("Arnon", "pearl", "Numbers 21:13", "The Arnon marked a boundary in Israel’s wilderness journey."),
  ]),
  q("revelation-church", "Name one of the seven churches addressed in Revelation.", "Books", [
    answer("Ephesus", "ink", "Revelation 2:1", "The first message is addressed to Ephesus."),
    answer("Laodicea", "ink", "Revelation 3:14", "The final message is addressed to Laodicea."),
    answer("Smyrna", "bronze", "Revelation 2:8", "A message is addressed to the church in Smyrna."),
    answer("Philadelphia", "silver", "Revelation 3:7", "A message is addressed to the church in Philadelphia."),
    answer("Pergamum", "gold", "Revelation 2:12", "A message is addressed to the church in Pergamum.", ["Pergamos"]),
    answer("Thyatira", "pearl", "Revelation 2:18", "A message is addressed to the church in Thyatira."),
    answer("Sardis", "pearl", "Revelation 3:1", "A message is addressed to the church in Sardis."),
  ]),
  q("tabernacle-object", "Name an object associated with the tabernacle.", "Objects", [
    answer("Ark of the Covenant", "ink", "Exodus 25:10–22", "The ark stood at the center of the Most Holy Place.", ["ark"]),
    answer("Altar", "ink", "Exodus 27:1–8", "The bronze altar stood in the tabernacle court."),
    answer("Lampstand", "bronze", "Exodus 25:31–40", "A gold lampstand was made for the tabernacle.", ["menorah"]),
    answer("Table of showbread", "bronze", "Exodus 25:23–30", "Bread of the Presence was placed on the table.", ["table", "showbread"]),
    answer("Bronze basin", "silver", "Exodus 30:18", "The bronze basin stood between the tent and altar.", ["laver"]),
    answer("Incense altar", "silver", "Exodus 30:1–10", "Incense was burned on the gold altar."),
    answer("Veil", "gold", "Exodus 26:31–33", "The veil separated the Holy Place from the Most Holy Place.", ["curtain"]),
    answer("Mercy seat", "gold", "Exodus 25:17–22", "The mercy seat formed the cover of the ark."),
    answer("Golden snuffers", "pearl", "Exodus 25:38", "Gold tongs and trays accompanied the lampstand.", ["tongs"]),
    answer("Silver bases", "pearl", "Exodus 26:19", "Silver bases supported the tabernacle frames.", ["sockets"]),
  ]),
  q("tribe", "Name one of the twelve tribes of Israel.", "People", [
    answer("Judah", "ink", "Numbers 1:26–27", "Judah is counted among the tribes."),
    answer("Benjamin", "ink", "Numbers 1:36–37", "Benjamin is counted among the tribes."),
    answer("Levi", "bronze", "Numbers 1:47–49", "Levi was set apart from the military census."),
    answer("Reuben", "bronze", "Numbers 1:20–21", "Reuben is counted as Israel’s firstborn tribe."),
    answer("Ephraim", "silver", "Numbers 1:32–33", "Ephraim descended from Joseph."),
    answer("Manasseh", "silver", "Numbers 1:34–35", "Manasseh descended from Joseph."),
    answer("Dan", "gold", "Numbers 1:38–39", "Dan is counted among the tribes."),
    answer("Asher", "gold", "Numbers 1:40–41", "Asher is counted among the tribes."),
    answer("Naphtali", "pearl", "Numbers 1:42–43", "Naphtali is counted among the tribes."),
    answer("Zebulun", "pearl", "Numbers 1:30–31", "Zebulun is counted among the tribes."),
    answer("Simeon", "bronze", "Numbers 1:22–23", "Simeon is counted among the tribes."),
    answer("Issachar", "gold", "Numbers 1:28–29", "Issachar is counted among the tribes."),
    answer("Gad", "pearl", "Numbers 1:24–25", "Gad is counted among the tribes."),
  ]),
  q("bible-occupation", "Name an occupation held by someone in the Bible.", "Daily Life", [
    answer("Fisherman", "ink", "Matthew 4:18", "Peter and Andrew were fishermen."),
    answer("Shepherd", "ink", "1 Samuel 16:11", "David was tending sheep when Samuel came."),
    answer("Carpenter", "bronze", "Mark 6:3", "Jesus was known in Nazareth as the carpenter."),
    answer("Tentmaker", "silver", "Acts 18:3", "Paul, Aquila, and Priscilla worked as tentmakers."),
    answer("Physician", "silver", "Colossians 4:14", "Luke is called the beloved physician."),
    answer("Cupbearer", "gold", "Nehemiah 1:11", "Nehemiah served as the king’s cupbearer."),
    answer("Purple-goods seller", "gold", "Acts 16:14", "Lydia was a seller of purple goods.", ["merchant"]),
    answer("Tanner", "pearl", "Acts 9:43", "Peter stayed with Simon, a tanner."),
    answer("Silversmith", "pearl", "Acts 19:24", "Demetrius made silver shrines of Artemis."),
    answer("Tax collector", "bronze", "Matthew 9:9", "Matthew worked as a tax collector."),
    answer("Scribe", "silver", "Ezra 7:6", "Ezra was a scribe skilled in the Law of Moses."),
    answer("Farmer", "gold", "2 Timothy 2:6", "Paul uses the hardworking farmer as a familiar occupation.", ["husbandman"]),
    answer("Potter", "gold", "Jeremiah 18:3", "Jeremiah visited a potter working at his wheel."),
    answer("Weaver", "pearl", "Exodus 35:35", "Skilled craftspeople in Israel worked as weavers."),
  ]),
  q("biblical-island", "Name an island mentioned in the Bible.", "Places", [
    answer("Crete", "ink", "Acts 27:7", "Paul’s ship sailed under the lee of Crete."),
    answer("Malta", "bronze", "Acts 28:1", "The shipwreck survivors learned the island was Malta."),
    answer("Cyprus", "silver", "Acts 13:4", "Barnabas and Saul sailed to Cyprus."),
    answer("Patmos", "gold", "Revelation 1:9", "John was on Patmos because of the word of God."),
    answer("Rhodes", "pearl", "Acts 21:1", "Paul’s company sailed from Cos to Rhodes."),
    answer("Cos", "pearl", "Acts 21:1", "Paul’s company sailed directly to Cos.", ["Kos"]),
    answer("Chios", "gold", "Acts 20:15", "Paul’s ship came opposite the island of Chios."),
    answer("Samos", "gold", "Acts 20:15", "Paul’s company sailed from Chios to Samos."),
    answer("Lesbos", "pearl", "Acts 20:14", "Paul’s companions sailed to Mitylene on Lesbos."),
    answer("Cauda", "pearl", "Acts 27:16", "Paul’s storm-driven ship ran under the lee of Cauda.", ["Clauda"]),
  ]),
  q("named-well", "Name a well mentioned in the Bible.", "Places", [
    answer("Jacob’s well", "ink", "John 4:6", "Jesus rested at Jacob’s well near Sychar."),
    answer("Beer-sheba", "bronze", "Genesis 21:30–31", "Abraham and Abimelech made a covenant at Beersheba.", ["Beersheba"]),
    answer("Beer-lahai-roi", "silver", "Genesis 16:14", "The well was named Beer-lahai-roi after Hagar encountered the Lord.", ["Beer Lahai Roi"]),
    answer("Esek", "gold", "Genesis 26:20", "Isaac named the disputed well Esek."),
    answer("Sitnah", "gold", "Genesis 26:21", "Isaac named another disputed well Sitnah."),
    answer("Rehoboth", "pearl", "Genesis 26:22", "Isaac named an uncontested well Rehoboth."),
    answer("Beer", "pearl", "Numbers 21:16", "Israel gathered at Beer, where the Lord provided water."),
  ]),
  q("gate", "Name a gate of Jerusalem mentioned in the Bible.", "Places", [
    answer("Sheep Gate", "ink", "Nehemiah 3:1", "Eliashib and the priests rebuilt the Sheep Gate."),
    answer("Fish Gate", "bronze", "Nehemiah 3:3", "The sons of Hassenaah built the Fish Gate."),
    answer("Old Gate", "silver", "Nehemiah 3:6", "Joiada and Meshullam repaired the Old Gate."),
    answer("Valley Gate", "silver", "Nehemiah 3:13", "Hanun and the inhabitants of Zanoah repaired the Valley Gate."),
    answer("Dung Gate", "gold", "Nehemiah 3:14", "Malchijah repaired the Dung Gate."),
    answer("Fountain Gate", "gold", "Nehemiah 3:15", "Shallum repaired the Fountain Gate."),
    answer("Water Gate", "pearl", "Nehemiah 3:26", "The temple servants lived near the Water Gate."),
    answer("Horse Gate", "pearl", "Nehemiah 3:28", "The priests repaired above the Horse Gate."),
    answer("East Gate", "gold", "Nehemiah 3:29", "Shemaiah repaired opposite the East Gate."),
    answer("Inspection Gate", "pearl", "Nehemiah 3:31", "The goldsmiths repaired as far as the Inspection Gate.", ["Muster Gate", "Miphkad Gate"]),
  ]),
];

const BASE_QUESTIONS: Question[] = [...CORE_QUESTIONS, ...YEAR_QUESTIONS];

function alternatePrompt(prompt: string, style: "identify" | "example") {
  const remainder = prompt.replace(/^Name\s+/i, "").replace(/^one\s+/i, "one ");
  if (style === "identify") return `Identify ${remainder.charAt(0).toLowerCase()}${remainder.slice(1)}`;
  return `From Scripture, name ${remainder.charAt(0).toLowerCase()}${remainder.slice(1)}`;
}

function promptVariants(question: Question): Question[] {
  return [
    question,
    { ...question, id: `${question.id}-identify`, prompt: alternatePrompt(question.prompt, "identify") },
    { ...question, id: `${question.id}-example`, prompt: alternatePrompt(question.prompt, "example") },
  ];
}

function poolVariants(questionIds: readonly string[]) {
  return [
    ...questionIds,
    ...questionIds.map((id) => `${id}-identify`),
    ...questionIds.map((id) => `${id}-example`),
  ];
}

export const QUESTIONS: Question[] = BASE_QUESTIONS.flatMap(promptVariants);

export const DAILY_SCROLLS: DailyScroll[] = build2027Calendar({
  oldTestament: poolVariants(["jacob-son", "judge", "judah-king", "ot-woman", "tribe", "tabernacle-object", ...YEAR_QUESTION_POOLS.oldTestament]),
  newTestament: poolVariants(["apostle", "paul-city", "jesus-miracle", "parable", "paul-companion", "revelation-church", ...YEAR_QUESTION_POOLS.newTestament]),
  wholeBible: poolVariants(["bible-animal", "prophet", "mountain", "dreamer", "river", "bible-occupation", ...YEAR_QUESTION_POOLS.wholeBible]),
  niche: poolVariants(["named-well", "gate", "biblical-island", ...YEAR_QUESTION_POOLS.niche]),
});

export function normalizeAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const removableLeadWords = new Set([
  "a", "an", "the", "parable", "of", "story", "about", "saint", "st",
]);

const matchingStopWords = new Set([
  "a", "an", "and", "at", "by", "for", "from", "his", "her", "in", "of", "on", "the", "to", "with",
]);

function meaningfulAnswer(value: string) {
  const words = normalizeAnswer(value).split(" ").filter(Boolean);
  while (words.length > 1 && removableLeadWords.has(words[0])) words.shift();
  return words.join(" ");
}

function answerTokens(value: string) {
  return normalizeAnswer(value).split(" ").filter((word) => word.length > 1 && !matchingStopWords.has(word));
}

function editDistance(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[right.length];
}

export function findQuestion(id: string) {
  return QUESTIONS.find((question) => question.id === id);
}

export function matchAnswer(question: Question, value: string) {
  const normalized = normalizeAnswer(value);
  if (!normalized) return undefined;

  const candidates = question.answers.map((candidate) => ({
    candidate,
    forms: [candidate.label, ...(candidate.aliases ?? [])]
      .flatMap((form) => [normalizeAnswer(form), meaningfulAnswer(form)])
      .filter(Boolean),
  }));

  // Curated aliases win first. This lets a natural shorthand such as “water”
  // resolve intentionally even when that word appears in another answer.
  const exact = candidates.find(({ forms }) => forms.includes(normalized) || forms.includes(meaningfulAnswer(value)));
  if (exact) return exact.candidate;

  const query = meaningfulAnswer(value);
  if (query.length < 4) return undefined;

  // A complete, distinctive keyword can stand on its own (for example,
  // “Bartimaeus”), but an unfinished prefix cannot earn points.
  if (!query.includes(" ")) {
    const keywordMatches = candidates.filter(({ forms }) =>
      forms.some((form) => answerTokens(form).includes(query)),
    );
    if (keywordMatches.length === 1) return keywordMatches[0].candidate;
  }

  // Natural answers often omit a connecting word or reverse a phrase. Accept
  // the wording only when its meaningful tokens identify exactly one answer.
  const queryTokens = answerTokens(value);
  if (queryTokens.length >= 2) {
    const tokenMatches = candidates.filter(({ forms }) => forms.some((form) => {
      const formTokens = answerTokens(form);
      return queryTokens.every((queryToken) => formTokens.some((formToken) =>
        formToken === queryToken
        || (queryToken.length >= 6 && formToken.length >= 6 && editDistance(formToken, queryToken) <= 1)
      ));
    }));
    if (tokenMatches.length === 1) return tokenMatches[0].candidate;
  }

  return undefined;
}

export function findCorrectionSuggestion(question: Question, value: string) {
  const query = meaningfulAnswer(value);
  if (query.length < 4) return undefined;

  const matches = question.answers
    .map((candidate) => {
      const forms = [candidate.label, ...(candidate.aliases ?? [])]
        .flatMap((form) => [normalizeAnswer(form), meaningfulAnswer(form)])
        .filter(Boolean);
      let score = Number.POSITIVE_INFINITY;
      for (const form of forms) {
        if (form.startsWith(query) && form.length - query.length <= 5) {
          score = Math.min(score, form.length - query.length + 2);
        }
        for (const word of form.split(" ")) {
          if (word.startsWith(query) && word.length - query.length <= 5) {
            score = Math.min(score, word.length - query.length + 2);
          }
        }
        const typoLimit = query.length >= 8 ? 2 : 1;
        if (Math.abs(form.length - query.length) <= typoLimit) {
          const distance = editDistance(form, query);
          if (distance <= typoLimit) score = Math.min(score, distance);
        }
      }
      if ((query === "eliezer" || query === "eleazer") && normalizeAnswer(candidate.label) === "eleazar") score = 0;
      return { candidate, score };
    })
    .filter(({ score }) => Number.isFinite(score))
    .sort((left, right) => left.score - right.score);

  if (!matches.length || (matches[1] && matches[1].score === matches[0].score)) return undefined;
  return matches[0].candidate;
}

export function rejectedAnswerMessage(question: Question, value: string) {
  const query = meaningfulAnswer(value);
  if (query.length < 3) return "Add a little more detail so the answer can be identified.";
  return "Not accepted for this question. Try another biblical example.";
}

export function getPacificDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getDailyScroll(date = new Date()) {
  const dateKey = getPacificDateKey(date);
  const scheduled = DAILY_SCROLLS.find((scroll) => scroll.dateKey === dateKey);
  if (scheduled) return scheduled;
  const [year, month, day] = getPacificDateKey(date).split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
  return DAILY_SCROLLS[((dayNumber % DAILY_SCROLLS.length) + DAILY_SCROLLS.length) % DAILY_SCROLLS.length];
}

export function questionsForScroll(scroll: DailyScroll) {
  return scroll.questionIds.map(findQuestion).filter((item): item is Question => Boolean(item));
}
