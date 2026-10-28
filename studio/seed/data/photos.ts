import type {SeedPhoto} from '../types'

// Every ID here was checked to return 200 from images.unsplash.com and looked at, so the alt
// text describes the actual photo. Covers are in stays.ts; these are the shared extra shots, and none
// of them is another stay's cover, so no house appears under two stays.

const photo = (id: string, alt: string): SeedPhoto => ({id, alt})

export const INTERIOR = {
  fireplaceLounge: photo('1501183638710-841dd1904471', 'Living room with a wood fireplace'),
  greyLounge: photo('1560185007-cde436f6a4d0', 'Open dining and living area with bay windows'),
  modernLounge: photo('1600607687939-ce8a6c25118c', 'Open-plan living room with a long wood wall'),
  tealLounge: photo('1554995207-c18c203602cb', 'Living room with a cognac sofa and green wall'),
  coastalLounge: photo(
    '1505691938895-1758d7feb511',
    'Sofa with blue cushions and a coastal painting',
  ),
  yellowChair: photo('1586023492125-27b2c045efd7', 'Yellow armchair by a white wall'),
  calmCorner: photo('1513694203232-719a280e022f', 'Calm corner with a small sofa and a dresser'),
  stairs: photo('1502005229762-cf1b2da7c5d6', 'Oak staircase with pendant lights'),
  blueSofa: photo('1493809842364-78817add7ffb', 'Blue sofa beside a white media wall'),
  cozyBedroom: photo('1522771739844-6a9f6d5f14af', 'Bed with patterned pillows and a bedside lamp'),
  classicBedroom: photo('1505693416388-ac5ce068fe85', 'Upholstered bed with a tufted bench'),
  hotelBedroom: photo('1512918728675-ed5a9ecdebfd', 'Bedroom with a padded headboard'),
  roomyBedroom: photo('1560185893-a55cbc8c57e8', 'Large bedroom with a patterned rug'),
  whiteBedroom: photo('1595526114035-0d45ed16cfbf', 'White bedroom with two windows'),
  openKitchen: photo('1484154218962-a197022b5858', 'White kitchen with a breakfast bar'),
  chefKitchen: photo(
    '1556911220-bff31c812dba',
    'Kitchen counter with fresh lemons and copper pots',
  ),
  islandKitchen: photo('1507089947368-19c1da9775ae', 'Kitchen island with pendant lights'),
  glassBath: photo('1584622650111-993a426fbf0a', 'Bathroom with a glass shower'),
  plantBath: photo('1552321554-5fefe8c9ef14', 'Small white bathroom with plants'),
}

export const OUTDOOR = {
  lakeRowboat: photo('1476514525535-07fb3b4ae5f1', 'Wooden boat bow on a mountain lake'),
  clearLake: photo('1501785888041-af3ef285b470', 'Turquoise lake below steep mountains'),
  peaksAboveClouds: photo('1506905925346-21bda4d32df4', 'Mountain peaks above a sea of clouds'),
  sunsetBeach: photo('1507525428034-b723cf961d3e', 'Waves on a sandy beach at sunrise'),
  duskShore: photo('1473116763249-2faaef81ccda', 'Shoreline at dusk'),
  palmBeach: photo('1519046904884-53103b34b206', 'Palm tree on a white sand beach'),
  clearWater: photo('1502784444187-359ac186c5bb', 'Paddleboards on clear turquoise water'),
  beachUmbrellas: photo('1488462237308-ecaa28b729d7', 'Orange beach umbrellas against the sky'),
  nightPool: photo('1571896349842-33c89424de2d', 'Pool reflecting the lit house at dusk'),
  palmPool: photo('1551882547-ff40c63fe5fa', 'Palms over a still pool at sunset'),
  tropicalPool: photo('1520250497591-112f2f40a3f4', 'Pool among palms and green hills'),
  deckSpa: photo('1566073771259-6a8506099945', 'Deck with loungers beside a spa pool'),
  glassStairs: photo('1600573472550-8090b5e0745e', 'Glass-walled stairwell above a pool'),
  woodFacade: photo('1600566753190-17f0baa2a6c3', 'Wood and glass facade with a courtyard'),
}
