export type ScoresDto = {
  rhymes?: number;
  structure?: number;
  style?: number;
  individuality?: number;
  atmosphere?: number;
};

export type SaveReviewDto = {
  targetId: string;
  targetType?: 'album' | 'track' | 'artist';
  title?: string;
  text: string;
  scores: ScoresDto;
  itemTitle?: string;
  itemArtist?: string;
  itemCover?: string;
  itemYear?: number;
};
