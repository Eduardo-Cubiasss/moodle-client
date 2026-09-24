/** Return all the possible jumps for the pages in a given lesson. */
export interface ModLessonGetPagesPossibleJumpsParams {
    /** lesson instance id */
    lessonid: number | null;
}

export interface ModLessonGetPagesPossibleJumpsReturns {
    jumps: Array<{
        /** The page id */
        pageid: number | null;
        /** The answer id */
        answerid: number | null;
        /** The jump (page id or type of jump) */
        jumpto: number | null;
        /** The real page id (or EOL) to jump */
        calculatedjump: number | null;
    }>;
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type ModLessonGetPagesPossibleJumpsReturn = ModLessonGetPagesPossibleJumpsReturns;
export type mod_lesson_get_pages_possible_jumps_returns = ModLessonGetPagesPossibleJumpsReturns;
