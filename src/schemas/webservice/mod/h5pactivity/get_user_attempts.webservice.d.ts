/** Return the information needed to list all enrolled user attempts. */
export interface ModH5pactivityGetUserAttemptsParams {
    /** h5p activity instance id */
    h5pactivityid: number | null;
    /** sort by either user id, firstname or lastname (with optional asc/desc) */
    sortorder?: string | null;
    /** current page */
    page?: number | null;
    /** items per page */
    perpage?: number | null;
    /** Users whose first name starts with $firstinitial */
    firstinitial?: string | null;
    /** Users whose last name starts with $lastinitial */
    lastinitial?: string | null;
}

/** Activity attempts data */
export interface ModH5pactivityGetUserAttemptsReturns {
    /** Activity course module ID */
    activityid: number | null;
    /** The complete users attempts list */
    usersattempts: Array<{
        /** The user id */
        userid: number | null;
        /** The complete attempts list */
        attempts: Array<{
            /** ID of the context */
            id: number | null;
            /** ID of the H5P activity */
            h5pactivityid: number | null;
            /** ID of the user */
            userid: number | null;
            /** Attempt creation */
            timecreated: number | null;
            /** Attempt modified */
            timemodified: number | null;
            /** Attempt number */
            attempt: number | null;
            /** Attempt score value */
            rawscore: number | null;
            /** Attempt max score */
            maxscore: number | null;
            /** Attempt duration in seconds */
            duration: number | null;
            /** Attempt completion */
            completion?: number | null;
            /** Attempt success */
            success?: number | null;
            /** Attempt scaled */
            scaled: number | null;
        }>;
        /** Attempts used to grade the activity */
        scored?: {
            /** Scored attempts title */
            title: string | null;
            /** Grading method */
            grademethod: string | null;
            /** List of the grading attempts */
            attempts: Array<{
                /** ID of the context */
                id: number | null;
                /** ID of the H5P activity */
                h5pactivityid: number | null;
                /** ID of the user */
                userid: number | null;
                /** Attempt creation */
                timecreated: number | null;
                /** Attempt modified */
                timemodified: number | null;
                /** Attempt number */
                attempt: number | null;
                /** Attempt score value */
                rawscore: number | null;
                /** Attempt max score */
                maxscore: number | null;
                /** Attempt duration in seconds */
                duration: number | null;
                /** Attempt completion */
                completion?: number | null;
                /** Attempt success */
                success?: number | null;
                /** Attempt scaled */
                scaled: number | null;
            }>;
        };
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

export type ModH5pactivityGetUserAttemptsReturn = ModH5pactivityGetUserAttemptsReturns;
export type mod_h5pactivity_get_user_attempts_returns = ModH5pactivityGetUserAttemptsReturns;
