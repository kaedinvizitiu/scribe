import type { DailyScroll } from "./game";

export type CalendarPools = {
  oldTestament: string[];
  newTestament: string[];
  wholeBible: string[];
  niche: string[];
};

const titleFirst = [
  "Ancient", "Burning", "Covenant", "Desert", "Faithful", "Golden", "Hidden", "Living",
  "Midnight", "Olive", "Pilgrim", "Royal", "Scarlet", "Shepherd’s", "Still", "Watchman’s",
];

const titleSecond = [
  "Lamp", "Scroll", "Road", "Well", "Gate", "Song", "Table", "Journey",
  "Trumpet", "Vine", "Stone", "River", "Crown", "Harbor", "Field", "Vision",
  "Manna", "Mount", "Promise", "Witness", "Path", "Fire", "Dawn",
];

function take(pool: string[], start: number, count: number, step: number, used: Set<string>) {
  const selected: string[] = [];
  let cursor = ((start % pool.length) + pool.length) % pool.length;
  let guard = 0;
  while (selected.length < count && guard < pool.length * 3) {
    const candidate = pool[cursor];
    if (!used.has(candidate)) {
      selected.push(candidate);
      used.add(candidate);
    }
    cursor = (cursor + step) % pool.length;
    guard += 1;
  }
  return selected;
}

export function build2027Calendar(pools: CalendarPools): DailyScroll[] {
  return Array.from({ length: 365 }, (_, dayIndex) => {
    const used = new Set<string>();
    const oldTestament = take(pools.oldTestament, dayIndex * 2, 2, 1, used);
    const newTestament = take(pools.newTestament, dayIndex * 2 + 13, 2, 1, used);
    const wholeBible = take(pools.wholeBible, dayIndex * 2 + 29, 2, 1, used);
    const niche = take(pools.niche, dayIndex + 17, 1, 1, used);
    const questionIds = [
      oldTestament[0], newTestament[0], wholeBible[0], oldTestament[1],
      newTestament[1], wholeBible[1], niche[0],
    ];
    const date = new Date(Date.UTC(2027, 0, dayIndex + 1));
    const dateKey = date.toISOString().slice(0, 10);
    const first = titleFirst[dayIndex % titleFirst.length];
    const second = titleSecond[Math.floor(dayIndex / titleFirst.length) % titleSecond.length];
    return {
      id: dateKey,
      dateKey,
      title: `The ${first} ${second}`,
      subtitle: "Seven questions from across Scripture",
      questionIds,
      deepQuestionId: questionIds[6],
    };
  });
}
