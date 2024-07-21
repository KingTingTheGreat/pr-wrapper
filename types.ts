export type ArticleTitle = string;

export type SemesterArticles = ArticleTitle[];

export type AllJournals = {
  [semester: string]: SemesterArticles;
};
