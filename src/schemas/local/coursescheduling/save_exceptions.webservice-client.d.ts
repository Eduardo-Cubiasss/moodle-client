/** Crea o actualiza excepciones de grupo o usuario para assign, quiz y lesson. */
export interface LocalCourseschedulingSaveExceptionsParams {
    courses: Array<{
        /** ID del curso */
        courseid: number | null;
        exceptions: Array<{
            /** Tipo de modulo (assign, quiz, lesson) */
            moduletype: string | null;
            /** ID de la instancia del modulo */
            instanceid: number | null;
            /** ID del usuario (0 si es de grupo) */
            userid?: number | null;
            /** ID del grupo (0 si es de usuario) */
            groupid?: number | null;
            /** Timestamp abrir desde */
            allowfrom?: number | null;
            /** Timestamp cerrar hasta */
            allowuntil?: number | null;
            /** Limite de tiempo en segundos */
            timelimit?: number | null;
        }>;
    }>;
}

export interface LocalCourseschedulingSaveExceptionsReturns {
    /** Estado general de la operación masiva */
    status: boolean | null;
    /** Mensaje general */
    message: string | null;
    /** Resultados agrupados por curso */
    details?: Array<{
        /** ID del curso procesado */
        courseid: number | null;
        /** ¿El curso se validó con éxito? */
        status: boolean | null;
        /** Razón del fallo general o éxito del curso */
        message: string | null;
        /** Detalle individual de cada excepción en este curso */
        exceptions?: Array<{
            /** Tipo de modulo */
            moduletype: string | null;
            /** ID de la instancia */
            instanceid: number | null;
            /** ¿Se guardó la excepción? */
            status: boolean | null;
            /** Mensaje individual */
            message: string | null;
        }>;
    }>;
}

export type LocalCourseschedulingSaveExceptionsReturn = LocalCourseschedulingSaveExceptionsReturns;
export type local_coursescheduling_save_exceptions_returns = LocalCourseschedulingSaveExceptionsReturns;
