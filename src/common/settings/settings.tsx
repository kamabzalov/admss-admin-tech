export const RecordsPerPageSteps: ReadonlyArray<number> = [5, 10, 15, 20];

export type RecordsPerPage = typeof RecordsPerPageSteps[number];
export const DefaultRecordsPerPage: RecordsPerPage = RecordsPerPageSteps[1];

export const VisiblePageCount = 3;

export const ShowEmptyLeadFields = false;
