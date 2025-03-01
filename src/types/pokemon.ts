export interface Pokemon {
  id: number;
  name: string;
  url?: string;
  sprites?: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  types?: {
    type: {
      name: string;
    }
  }[];
  stats?: Stat[];
  height?: number;
  weight?: number;
  abilities?: {
    ability: {
      name: string;
    }
  }[];
  species?: {
    url: string;
  };
  moves?: {
    move: {
      name: string;
      url: string;
    }
  }[];
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  }
}