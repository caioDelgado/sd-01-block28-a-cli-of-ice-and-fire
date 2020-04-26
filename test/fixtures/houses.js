
const firstHouseBody = [
  {
    url: "https://anapioficeandfire.com/api/houses/1",
    name: "House Algood",
    region: "The Westerlands",
    coatOfArms: "A golden wreath, on a blue field with a gold border(Azure, a garland of laurel within a bordure or)",
    words: "",
    titles: [
      ""
    ],
    seats: [
      ""
    ],
    currentLord: "",
    heir: "",
    overlord: "https://anapioficeandfire.com/api/houses/229",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: []
  },
];

const secondHouseBody = [
  {
    url: "https://anapioficeandfire.com/api/houses/2",
    name: "House Allyrion of Godsgrace",
    region: "Dorne",
    coatOfArms: "Gyronny Gules and Sable, a hand couped Or",
    words: "No Foe May Pass",
    titles: [
      ""
    ],
    seats: [
      "Godsgrace"
    ],
    currentLord: "https://anapioficeandfire.com/api/characters/298",
    heir: "https://anapioficeandfire.com/api/characters/1922",
    overlord: "https://anapioficeandfire.com/api/houses/285",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: [
      "https://anapioficeandfire.com/api/characters/298",
      "https://anapioficeandfire.com/api/characters/1129",
      "https://anapioficeandfire.com/api/characters/1301",
      "https://anapioficeandfire.com/api/characters/1922"
    ]
  }
];

const lastHouseBody = [
  {
    url: "https://anapioficeandfire.com/api/houses/444",
    name: "House Yronwood of Yronwood",
    region: "Dorne",
    coatOfArms: "Or, a portcullis sable",
    words: "We Guard the Way",
    titles: [
      "The Bloodroyal",
      "Lord of Yronwood",
      "Warden of the Stone Way",
      "High King of Dorne (formerly)"
    ],
    seats: [
      "Yronwood"
    ],
    currentLord: "https://anapioficeandfire.com/api/characters/117",
    heir: "https://anapioficeandfire.com/api/characters/452",
    overlord: "https://anapioficeandfire.com/api/houses/285",
    founded: "",
    founder: "",
    diedOut: "",
    ancestralWeapons: [
      ""
    ],
    cadetBranches: [],
    swornMembers: [
      "https://anapioficeandfire.com/api/characters/117",
      "https://anapioficeandfire.com/api/characters/126",
      "https://anapioficeandfire.com/api/characters/246",
      "https://anapioficeandfire.com/api/characters/452",
      "https://anapioficeandfire.com/api/characters/793",
      "https://anapioficeandfire.com/api/characters/1129"
    ]
  },
];

const linkHeaders = {
  hasNext: '<https://www.anapioficeandfire.com/api/houses?page=2&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/houses?page=444&pageSize=10>; rel="last"',
  hasPrevious: '<https://www.anapioficeandfire.com/api/houses?page=443&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/houses?page=444&pageSize=10>; rel="last"',
  hasBoth: '<https://www.anapioficeandfire.com/api/houses?page=3&pageSize=10>; rel="next", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="prev", <https://www.anapioficeandfire.com/api/houses?page=1&pageSize=10>; rel="first", <https://www.anapioficeandfire.com/api/houses?page=444&pageSize=10>; rel="last"',
};

const responses = {
  hasNext: { body: firstHouseBody, headers: { link: linkHeaders.hasNext } },
  hasPrevious: { body: lastHouseBody, headers: { link: linkHeaders.hasPrevious } },
  hasBoth: { body: secondHouseBody, headers: { link: linkHeaders.hasBoth } },
};

function getNames(body) {
  return body.map(({ name }) => name);
}

const names = {
  hasNext: getNames(firstHouseBody),
  hasPrevious: getNames(lastHouseBody),
  hasBoth: getNames(secondHouseBody),
};

module.exports = {
  responses,
  names,
};
