import { type Path, loadFile } from "../../utils";

async function ex1(path: Path, delimiter: string = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  const cardStrength: Record<string, number> = {
    A: 13,
    K: 12,
    Q: 11,
    J: 10,
    T: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
  };

  const typesStrength = {
    FiveOfAKind: 6,
    FourOfAKind: 5,
    FullHouse: 4,
    ThreeOfAKind: 3,
    TwoPair: 2,
    OnePair: 1,
    HighCard: 0,
  };

  function getHandStrength(hand: string) {
    const letterCount = hand.split("").reduce<Record<string, number>>((acc, char) => {
      if (acc[char]) {
        acc[char]++;
      } else {
        acc[char] = 1;
      }

      return acc;
    }, {});

    const values = Object.values(letterCount);

    if (values.includes(5)) {
      return typesStrength.FiveOfAKind;
    } else if (values.includes(4)) {
      return typesStrength.FourOfAKind;
    } else if (values.includes(3) && values.includes(2)) {
      return typesStrength.FullHouse;
    } else if (values.includes(3) && values.includes(1)) {
      return typesStrength.ThreeOfAKind;
    } else if (values.filter((v) => v === 2).length === 2) {
      return typesStrength.TwoPair;
    } else if (values.filter((v) => v === 2).length === 1) {
      return typesStrength.OnePair;
    } else {
      return typesStrength.HighCard;
    }
  }

  const hands = rows.map((row) => {
    const hand = row.split(/\s+/g)[0];
    const bid = Number(row.split(/\s+/g)[1]);

    return {
      hand,
      bid,
      strength: getHandStrength(hand),
    };
  });

  const sortedHands = hands.toSorted((a, b) => {
    if (a.strength === b.strength) {
      for (const [index, char] of a.hand.split("").entries()) {
        if (char === b.hand[index]) continue;
        return cardStrength[char] - cardStrength[b.hand[index]];
      }
    }

    return a.strength - b.strength;
  });

  return sortedHands.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0);
}

async function ex2(path: Path, delimiter: string = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  const cardStrength: Record<string, number> = {
    A: 13,
    K: 12,
    Q: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    J: 1,
  };

  const typesStrength = {
    FiveOfAKind: 6,
    FourOfAKind: 5,
    FullHouse: 4,
    ThreeOfAKind: 3,
    TwoPair: 2,
    OnePair: 1,
    HighCard: 0,
  };

  function getHandStrength(hand: string) {
    const letterCount = hand.split("").reduce<Record<string, number>>((acc, char) => {
      if (acc[char]) {
        acc[char]++;
      } else {
        acc[char] = 1;
      }

      return acc;
    }, {});

    if (letterCount.J > 0 && letterCount.J < 5) {
      const jockerCount = letterCount.J;
      delete letterCount.J;

      const highestCard = Object.entries(letterCount)
        .sort((a, b) => cardStrength[b[0]] - cardStrength[a[0]])
        .sort((a, b) => b[1] - a[1])[0][0];

      letterCount[highestCard] += jockerCount;
    }

    const values = Object.values(letterCount);

    if (values.includes(5)) {
      return typesStrength.FiveOfAKind;
    } else if (values.includes(4)) {
      return typesStrength.FourOfAKind;
    } else if (values.includes(3) && values.includes(2)) {
      return typesStrength.FullHouse;
    } else if (values.includes(3) && values.includes(1)) {
      return typesStrength.ThreeOfAKind;
    } else if (values.filter((v) => v === 2).length === 2) {
      return typesStrength.TwoPair;
    } else if (values.filter((v) => v === 2).length === 1) {
      return typesStrength.OnePair;
    } else {
      return typesStrength.HighCard;
    }
  }

  const hands = rows.map((row) => {
    const hand = row.split(/\s+/g)[0];
    const bid = Number(row.split(/\s+/g)[1]);

    return {
      hand,
      bid,
      strength: getHandStrength(hand),
    };
  });

  const sortedHands = hands.toSorted((a, b) => {
    if (a.strength === b.strength) {
      for (const [index, char] of a.hand.split("").entries()) {
        if (char === b.hand[index]) continue;
        return cardStrength[char] - cardStrength[b.hand[index]];
      }
    }

    return a.strength - b.strength;
  });

  return sortedHands.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("7/test1"));
console.log("EX1 Input Result: ", await ex1("7/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("7/test2"));
console.log("EX2 Result: ", await ex2("7/input"));
console.log("-----------------------");
248750699;
