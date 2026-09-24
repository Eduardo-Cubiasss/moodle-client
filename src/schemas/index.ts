import type { MoodleResponse, HttpMethod } from "@didactika/moodle-client";
export * from './local/coursescheduling/save_exceptions.webservice-client';
export * from './local/coursestate/get_student_courses.webservice-client';
export * from './local/coursestate/get_student_progress.webservice-client';
export * from './local/coursestate/get_course_state.webservice-client';
export * from './local/coursestate/get_course_activities.webservice-client';
export * from './local/coursestate/get_activity_completion_details.webservice-client';
export * from './local/coursestate/start_course.webservice-client';
export * from './local/coursestate/push_states.webservice-client';
export * from './local/coursestate/revoke_decision.webservice-client';
export * from './local/coursestate/delete_states.webservice-client';
export * from './local/overwatch/get_paginated_table_data.webservice-client';
export * from './local/serviceschema/get_schemas.webservice-client';
export * from './local/serviceschema/get_schema.webservice-client';
export * from './local/serviceschema/create_schema.webservice-client';
export * from './local/serviceschema/update_schema.webservice-client';
export * from './local/serviceschema/delete_schema.webservice-client';

import type { LocalCourseschedulingSaveExceptionsParams, LocalCourseschedulingSaveExceptionsReturns } from './local/coursescheduling/save_exceptions.webservice-client';
import type { LocalCoursestateGetStudentCoursesParams, LocalCoursestateGetStudentCoursesReturns } from './local/coursestate/get_student_courses.webservice-client';
import type { LocalCoursestateGetStudentProgressParams, LocalCoursestateGetStudentProgressReturns } from './local/coursestate/get_student_progress.webservice-client';
import type { LocalCoursestateGetCourseStateParams, LocalCoursestateGetCourseStateReturns } from './local/coursestate/get_course_state.webservice-client';
import type { LocalCoursestateGetCourseActivitiesParams, LocalCoursestateGetCourseActivitiesReturns } from './local/coursestate/get_course_activities.webservice-client';
import type { LocalCoursestateGetActivityCompletionDetailsParams, LocalCoursestateGetActivityCompletionDetailsReturns } from './local/coursestate/get_activity_completion_details.webservice-client';
import type { LocalCoursestateStartCourseParams, LocalCoursestateStartCourseReturns } from './local/coursestate/start_course.webservice-client';
import type { LocalCoursestatePushStatesParams, LocalCoursestatePushStatesReturns } from './local/coursestate/push_states.webservice-client';
import type { LocalCoursestateRevokeDecisionParams, LocalCoursestateRevokeDecisionReturns } from './local/coursestate/revoke_decision.webservice-client';
import type { LocalCoursestateDeleteStatesParams, LocalCoursestateDeleteStatesReturns } from './local/coursestate/delete_states.webservice-client';
import type { LocalOverwatchGetPaginatedTableDataParams, LocalOverwatchGetPaginatedTableDataReturns } from './local/overwatch/get_paginated_table_data.webservice-client';
import type { LocalServiceschemaGetSchemasParams, LocalServiceschemaGetSchemasReturns } from './local/serviceschema/get_schemas.webservice-client';
import type { LocalServiceschemaGetSchemaParams, LocalServiceschemaGetSchemaReturns } from './local/serviceschema/get_schema.webservice-client';
import type { LocalServiceschemaCreateSchemaParams, LocalServiceschemaCreateSchemaReturns } from './local/serviceschema/create_schema.webservice-client';
import type { LocalServiceschemaUpdateSchemaParams, LocalServiceschemaUpdateSchemaReturns } from './local/serviceschema/update_schema.webservice-client';
import type { LocalServiceschemaDeleteSchemaParams, LocalServiceschemaDeleteSchemaReturns } from './local/serviceschema/delete_schema.webservice-client';

/**
 * Typed Moodle Web Service operations available on MoodleClient.
 */
export interface GeneratedMoodleServices {
    /**
     * Crea o actualiza excepciones de grupo o usuario para assign, quiz y lesson.
     *
     * @param {LocalCourseschedulingSaveExceptionsParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCourseschedulingSaveExceptionsReturns>>}
     */
    local_coursescheduling_save_exceptions(params: LocalCourseschedulingSaveExceptionsParams, method?: HttpMethod): Promise<MoodleResponse<LocalCourseschedulingSaveExceptionsReturns>>;
    /**
     * Everything the student who is asking has: induction courses, programmes and the rest.
     *
     * @param {LocalCoursestateGetStudentCoursesParams} [params]
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateGetStudentCoursesReturns>>}
     */
    local_coursestate_get_student_courses(params?: LocalCoursestateGetStudentCoursesParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateGetStudentCoursesReturns>>;
    /**
     * How far through each of their courses the student who is asking is. Asked after the tree, so the page is usable before the figures arrive.
     *
     * @param {LocalCoursestateGetStudentProgressParams} [params]
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateGetStudentProgressReturns>>}
     */
    local_coursestate_get_student_progress(params?: LocalCoursestateGetStudentProgressParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateGetStudentProgressReturns>>;
    /**
     * What the student who is asking may do with one course.
     *
     * @param {LocalCoursestateGetCourseStateParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateGetCourseStateReturns>>}
     */
    local_coursestate_get_course_state(params: LocalCoursestateGetCourseStateParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateGetCourseStateReturns>>;
    /**
     * What the activities of some courses are called and when they are open.
     *
     * @param {LocalCoursestateGetCourseActivitiesParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateGetCourseActivitiesReturns>>}
     */
    local_coursestate_get_course_activities(params: LocalCoursestateGetCourseActivitiesParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateGetCourseActivitiesReturns>>;
    /**
     * What each activity asks of the student before it counts as done.
     *
     * @param {LocalCoursestateGetActivityCompletionDetailsParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateGetActivityCompletionDetailsReturns>>}
     */
    local_coursestate_get_activity_completion_details(params: LocalCoursestateGetActivityCompletionDetailsParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateGetActivityCompletionDetailsReturns>>;
    /**
     * Records that the student who is asking is starting a course.
     *
     * @param {LocalCoursestateStartCourseParams} [params]
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateStartCourseReturns>>}
     */
    local_coursestate_start_course(params?: LocalCoursestateStartCourseParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateStartCourseReturns>>;
    /**
     * Writes the two decisions the service still owns: FINALIZED, and CLOSED for a recognized subject. Called by course-state-service.
     *
     * @param {LocalCoursestatePushStatesParams} [params]
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestatePushStatesReturns>>}
     */
    local_coursestate_push_states(params?: LocalCoursestatePushStatesParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestatePushStatesReturns>>;
    /**
     * Takes back a FINALIZED or a recognized subject and decides those courses again from what this site knows. Called by course-state-service.
     *
     * @param {LocalCoursestateRevokeDecisionParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateRevokeDecisionReturns>>}
     */
    local_coursestate_revoke_decision(params: LocalCoursestateRevokeDecisionParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateRevokeDecisionReturns>>;
    /**
     * Removes a batch of course states. Called by course-state-service.
     *
     * @param {LocalCoursestateDeleteStatesParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalCoursestateDeleteStatesReturns>>}
     */
    local_coursestate_delete_states(params: LocalCoursestateDeleteStatesParams, method?: HttpMethod): Promise<MoodleResponse<LocalCoursestateDeleteStatesReturns>>;
    /**
     * Paginated table query web service
     *
     * @param {LocalOverwatchGetPaginatedTableDataParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalOverwatchGetPaginatedTableDataReturns>>}
     */
    local_overwatch_get_paginated_table_data(params: LocalOverwatchGetPaginatedTableDataParams, method?: HttpMethod): Promise<MoodleResponse<LocalOverwatchGetPaginatedTableDataReturns>>;
    /**
     * Get all service schemas.
     *
     * @param {LocalServiceschemaGetSchemasParams} [params]
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalServiceschemaGetSchemasReturns>>}
     */
    local_serviceschema_get_schemas(params?: LocalServiceschemaGetSchemasParams, method?: HttpMethod): Promise<MoodleResponse<LocalServiceschemaGetSchemasReturns>>;
    /**
     * Get a single service schema by ID.
     *
     * @param {LocalServiceschemaGetSchemaParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalServiceschemaGetSchemaReturns>>}
     */
    local_serviceschema_get_schema(params: LocalServiceschemaGetSchemaParams, method?: HttpMethod): Promise<MoodleResponse<LocalServiceschemaGetSchemaReturns>>;
    /**
     * Create a new service schema.
     *
     * @param {LocalServiceschemaCreateSchemaParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalServiceschemaCreateSchemaReturns>>}
     */
    local_serviceschema_create_schema(params: LocalServiceschemaCreateSchemaParams, method?: HttpMethod): Promise<MoodleResponse<LocalServiceschemaCreateSchemaReturns>>;
    /**
     * Update an existing service schema.
     *
     * @param {LocalServiceschemaUpdateSchemaParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalServiceschemaUpdateSchemaReturns>>}
     */
    local_serviceschema_update_schema(params: LocalServiceschemaUpdateSchemaParams, method?: HttpMethod): Promise<MoodleResponse<LocalServiceschemaUpdateSchemaReturns>>;
    /**
     * Delete a service schema.
     *
     * @param {LocalServiceschemaDeleteSchemaParams} params
     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')
     * @returns {Promise<MoodleResponse<LocalServiceschemaDeleteSchemaReturns>>}
     */
    local_serviceschema_delete_schema(params: LocalServiceschemaDeleteSchemaParams, method?: HttpMethod): Promise<MoodleResponse<LocalServiceschemaDeleteSchemaReturns>>;
}

declare module "@didactika/moodle-client" {
    interface MoodleClient extends GeneratedMoodleServices {}
}
