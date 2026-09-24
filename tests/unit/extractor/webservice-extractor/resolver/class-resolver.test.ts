import fs from 'fs';
import { resolveClass } from '../../../../../src/generator/extractor/resolver/class-resolver';
import { MoodleService } from '../../../../../src/generator/extractor/interfaces/service-extractor.interfaces';
import * as ComponentResolver from '../../../../../src/generator/extractor/resolver/component-resolver';
import { ComponentMapRegistry } from '../../../../../src/generator/extractor/interfaces/component-resolver.interfaces';
import { extractServices } from '../../../../../src/generator/extractor/extractor/service-extractor';

// Subplugin Features Fixtures
import format1PSR4 from '../../../../fixtures/services/subplugins/format-1-PSR-4.json';
import format2PSR4Deep from '../../../../fixtures/services/subplugins/format-2-PSR4-subnamespace-profundo.json';
import format3ClasspathTrim from '../../../../fixtures/services/subplugins/format-3-classpath_trim.json';
import format4Legacy from '../../../../fixtures/services/subplugins/format-4-legacy.json';

vi.mock('fs');
vi.mock('../../../../../src/generator/extractor/resolver/component-resolver');

describe('Unit Test: class-resolver', () => {

    beforeEach(() => {
        const mockRegistry: ComponentMapRegistry = {
            plugintypes: new Map([
                ['tool', 'admin/tool'],
                ['aiplacement', 'ai/placement'],
                ['paygw', 'payment/gateway'],
                ['mod', 'mod'],
                ['auth', 'auth'],
                ['gradereport', 'grade/report'],
                ['gradingform', 'grade/grading/form'],
                ['block', 'blocks'],
                ['customfield', 'customfield/field'],
                ['media', 'media/player'],
                ['tiny', 'lib/editor/tiny/plugins'],
                ['quizaccess', 'mod/quiz/accessrule'],
                ['message', 'message/output']
            ]),
            subsystems: new Map([
                ['core', 'lib'],
                ['group', 'group'],
                ['core_group', 'group'],
                ['user', 'user'],
                ['core_user', 'user'],
                ['completion', 'completion'],
                ['core_completion', 'completion'],
                ['badges', 'badges'],
                ['core_badges', 'badges'],
                ['customfield', 'customfield'],
                ['media', 'media'],
                ['grades', 'grade'],
                ['core_grades', 'grade'],
                ['grading', 'grade/grading'],
                ['core_grading', 'grade/grading']
            ])
        };

        (ComponentResolver.resolverComponent as any).mockResolvedValue(mockRegistry);
        (fs.existsSync as any).mockReturnValue(false);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Subplugin Features from Fixtures', () => {

        it('should extract and resolve Format 1 (Atomic Modern PSR-4 Subplugins for TinyMCE)', async () => {
            const services = extractServices(format1PSR4);
            expect(services.length).toBe(3);

            const path0 = await resolveClass(services[0], './src/tmp/moodle/v/5.0');
            expect(path0).toBe('lib/editor/tiny/plugins/autosave/classes/external/resume_autosave_session.php');

            const path1 = await resolveClass(services[1], './src/tmp/moodle/v/5.0');
            expect(path1).toBe('lib/editor/tiny/plugins/autosave/classes/external/reset_autosave_session.php');

            const path2 = await resolveClass(services[2], './src/tmp/moodle/v/5.0');
            expect(path2).toBe('lib/editor/tiny/plugins/autosave/classes/external/update_autosave_session_content.php');
        });

        it('should extract and resolve Format 2 (Deep Nested PSR-4 Subplugins for Rubric Grading Panel)', async () => {
            const services = extractServices(format2PSR4Deep);
            expect(services.length).toBe(2);

            const resolved = await resolveClass(services[0], './src/tmp/moodle/v/5.0');
            expect(resolved).toBe('grade/grading/form/rubric/classes/grades/grader/gradingpanel/external/fetch.php');
        });

        it('should extract and resolve Format 3 (Safe Transition with Empty Classpath for PayPal Gateway)', async () => {
            const services = extractServices(format3ClasspathTrim);
            expect(services.length).toBe(2);

            const resolved = await resolveClass(services[0], './src/tmp/moodle/v/5.0');
            expect(resolved).toBe('payment/gateway/paypal/classes/external/get_config_for_js.php');
        });

        it('should extract and resolve Format 4 (Traditional Legacy with Explicit Classpath for Airnotifier)', async () => {
            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return filePath.includes('message/output/airnotifier/externallib.php');
            });

            const services = extractServices(format4Legacy);
            expect(services.length).toBe(4);

            const resolved = await resolveClass(services[0], './src/tmp/moodle/v/5.0');
            expect(resolved).toBe('message/output/airnotifier/externallib.php');
        });

    });

    describe('Monolithic Core Classes (Pattern 3 / Phase 4)', () => {

        it('should resolve core_grades_external to lib/classes/grades_external.php when it exists on disk', async () => {
            const service: MoodleService = {
                name: 'core_grades_get_feedback',
                classname: 'core_grades_external',
                type: 'read',
                methodname: 'get_feedback',
                description: 'Returns student feedback for a given grade item'
            };

            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return filePath.includes('lib/classes/grades_external.php');
            });

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/5.0');
            expect(resolvedPath).toEqual('lib/classes/grades_external.php');
        });

        it('should resolve core_grading_external to lib/classes/grading_external.php when it exists on disk', async () => {
            const service: MoodleService = {
                name: 'core_grading_get_definitions',
                classname: 'core_grading_external',
                type: 'read',
                methodname: 'get_definitions',
                description: 'Get grading definitions'
            };

            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return filePath.includes('lib/classes/grading_external.php');
            });

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/5.0');
            expect(resolvedPath).toEqual('lib/classes/grading_external.php');
        });

    });

    describe('Segregation and Collision Shielding (Pattern 2)', () => {

        it('should resolve customfield_number plugin to customfield/field/number without being overwritten by customfield subsystem', async () => {
            const service: MoodleService = {
                name: 'customfield_number_recalculate_value',
                classname: 'customfield_number\\external\\recalculate',
                type: 'write',
                methodname: 'execute',
                description: 'Recalculate customfield value',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/5.0');
            expect(resolvedPath).toEqual('customfield/field/number/classes/external/recalculate.php');
        });

        it('should resolve media_videojs plugin to media/player/videojs without being overwritten by media subsystem', async () => {
            const service: MoodleService = {
                name: 'media_videojs_get_language',
                classname: 'media_videojs\\external\\get_language',
                type: 'read',
                methodname: 'execute',
                description: 'Get language string',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/5.0');
            expect(resolvedPath).toEqual('media/player/videojs/classes/external/get_language.php');
        });

    });

    describe('Classpath Shielding and Fallback (Pattern 4)', () => {

        it('should return relative path when legacy class file has explicit classpath that exists on disk', async () => {
            const service: MoodleService = {
                name: 'enrol_manual_enrol_users',
                classname: 'enrol_manual_external',
                type: 'write',
                methodname: 'enrol_users',
                classpath: 'enrol/manual/externallib.php',
                description: 'Manual enrol users',
            };

            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return filePath.includes('enrol/manual/externallib.php');
            });

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('enrol/manual/externallib.php');
        });

        it('should discard typo in classpath when file does not exist on disk and resolve via Frankenstyle', async () => {
            const service: MoodleService = {
                name: 'block_starredcourses_get_starred_courses',
                classname: 'block_starredcourses_external',
                type: 'read',
                methodname: 'get_starred_courses',
                classpath: 'block/starredcourses/classes/external.php',
                description: 'Get users starred courses.',
            };

            (fs.existsSync as any).mockImplementation((filePath: string) => {
                if (filePath.includes('block/starredcourses/classes/external.php')) {
                    return false;
                }
                if (filePath.includes('blocks/starredcourses/classes/external.php')) {
                    return true;
                }
                return false;
            });

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/5.0');
            expect(resolvedPath).toEqual('blocks/starredcourses/classes/external.php');
        });

        it('should discard nonexistent classpath for namespaced class and resolve via PSR-4', async () => {
            const service: MoodleService = {
                name: 'aiplacement_editor_generate_image',
                classname: 'aiplacement_editor\\external\\generate_image',
                type: 'write',
                methodname: 'exact',
                classpath: 'invalid/broken/path.php',
                description: 'Generate image for the HTML Text editor AI Placement',
            };

            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return !filePath.includes('invalid/broken/path.php');
            });

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('ai/placement/editor/classes/external/generate_image.php');
        });

    });

    describe('Standard Resolution Paths', () => {

        it('should resolve Frankenstyle mod_wiki_external to mod/wiki/classes/external.php when classpath is omitted', async () => {
            const service: MoodleService = {
                name: 'mod_wiki_get_wikis_by_courses',
                classname: 'mod_wiki_external',
                type: 'read',
                methodname: 'get_wikis_by_courses',
                description: 'Returns list of wikis in given courses'
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('mod/wiki/classes/external.php');
        });

        it('should resolve Frankenstyle auth_email_external to auth/email/classes/external.php when classpath is null', async () => {
            const service: MoodleService = {
                name: 'auth_email_get_signup_settings',
                classname: 'auth_email_external',
                type: 'read',
                methodname: 'get_signup_settings',
                classpath: null,
                description: 'Get signup settings'
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('auth/email/classes/external.php');
        });

        it('should resolve Frankenstyle tool_xmldb_external to admin/tool/xmldb/classes/external.php when classpath is empty', async () => {
            const service: MoodleService = {
                name: 'tool_xmldb_invoke_move_action',
                classname: 'tool_xmldb_external',
                type: 'write',
                methodname: 'invoke_move_action',
                classpath: '',
                description: 'Moves element up or down'
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('admin/tool/xmldb/classes/external.php');
        });

        it('should resolve Frankenstyle core_completion_external to completion/classes/external.php', async () => {
            const service: MoodleService = {
                name: 'core_completion_get_activities_completion_status',
                classname: 'core_completion_external',
                type: 'read',
                methodname: 'get_activities_completion_status',
                description: 'Get completion status'
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('completion/classes/external.php');
        });

        it('should resolve Frankenstyle plugin prefix gradereport_overview_external to grade/report/overview/classes/external.php', async () => {
            const service: MoodleService = {
                name: 'gradereport_overview_get_course_grades',
                classname: 'gradereport_overview_external',
                type: 'read',
                methodname: 'get_course_grades',
                description: 'Get course grades'
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('grade/report/overview/classes/external.php');
        });

        it('should resolve namespaced class from classes/external.php when classpath is empty', async () => {
            const service: MoodleService = {
                name: 'tool_dataprivacy_mark_complete',
                classname: 'tool_dataprivacy\\external',
                type: 'write',
                methodname: 'mark_complete',
                classpath: '',
                description: "Mark a user's general enquiry as complete",
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('admin/tool/dataprivacy/classes/external.php');
        });

        it('should resolve namespaced class from classes/external.php when classpath is null', async () => {
            const service: MoodleService = {
                name: 'tool_analytics_potential_contexts',
                classname: 'tool_analytics\\external',
                type: 'read',
                methodname: 'potential_contexts',
                classpath: null,
                description: 'List of potential contexts for analytics models',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('admin/tool/analytics/classes/external.php');
        });

        it('should resolve legacy class file when modern service flags are present', async () => {
            const service: MoodleService = {
                name: 'message_popup_get_unread_popup_notification_count',
                classname: 'message_popup_external',
                type: 'read',
                methodname: 'get_unread_popup_notification_count',
                classpath: 'message/output/popup/externallib.php',
                description: 'Retrieve the count of unread popup notifications for a given user',
            };

            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return filePath.includes('message/output/popup/externallib.php');
            });

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('message/output/popup/externallib.php');
        });

        it('should resolve dedicated PSR-4 external class file', async () => {
            const service: MoodleService = {
                name: 'aiplacement_editor_generate_image',
                classname: 'aiplacement_editor\\external\\generate_image',
                type: 'write',
                methodname: 'exact',
                classpath: null,
                description: 'Generate image for the HTML Text editor AI Placement',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('ai/placement/editor/classes/external/generate_image.php');
        });

        it('should resolve deeply nested PSR-4 external class file', async () => {
            const service: MoodleService = {
                name: 'core_check_get_result_admintree',
                classname: 'core\\check\\external\\get_result_admintree',
                type: 'read',
                methodname: 'exact',
                classpath: null,
                description: 'Executes a check stored in the admin tree and returns the result',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('lib/classes/check/external/get_result_admintree.php');
        });

        it('should resolve dedicated PSR-4 class when methodname is explicitly execute', async () => {
            const service: MoodleService = {
                name: 'core_output_poll_stored_progress',
                classname: 'core\\external\\output\\poll_stored_progress',
                type: 'read',
                methodname: 'execute',
                classpath: null,
                description: 'Polls for the current percentage progress of a stored progress object',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('lib/classes/external/output/poll_stored_progress.php');
        });

        it('should resolve dedicated PSR-4 class for a minimal service definition', async () => {
            const service: MoodleService = {
                name: 'tool_admin_presets_delete_preset',
                classname: 'tool_admin_presets\\external\\delete_preset',
                type: 'write',
                methodname: 'exact',
                classpath: null,
                description: 'Delete a custom preset',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('admin/tool/admin_presets/classes/external/delete_preset.php');
        });

        it('should resolve namespaced payment gateway class with empty classpath', async () => {
            const service: MoodleService = {
                name: 'paygw_paypal_create_transaction_complete',
                classname: 'paygw_paypal\\external\\transaction_complete',
                type: 'write',
                methodname: 'exact',
                classpath: '',
                description: 'Takes care of what needs to be done when a PayPal transaction comes back as complete.',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('payment/gateway/paypal/classes/external/transaction_complete.php');
        });

        it('should resolve case where classname has leading backslashes', async () => {
            const service: MoodleService = {
                name: 'aiplacement_editor_generate_image',
                classname: '\\aiplacement_editor\\external\\generate_image',
                type: 'write',
                methodname: 'exact',
                description: 'Generate image',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toEqual('ai/placement/editor/classes/external/generate_image.php');
        });

        it('should return null when classname is empty string or only whitespace', async () => {
            const service: MoodleService = {
                name: 'invalid_service',
                classname: '   ',
                type: 'write',
                methodname: 'enrol_user',
                description: 'Invalid class',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/4.5');
            expect(resolvedPath).toBeNull();
        });

        it('should resolve core_external to lib/external/externallib.php when modern path exists', async () => {
            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return filePath.includes('lib/external/externallib.php');
            });

            const service: MoodleService = {
                name: 'core_fetch_notifications',
                classname: 'core_external',
                type: 'read',
                methodname: 'fetch_notifications',
                description: 'Fetch notifications',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/5.1');
            expect(resolvedPath).toBe('lib/external/externallib.php');
        });

        it('should resolve explicit classpath when file exists', async () => {
            (fs.existsSync as any).mockImplementation((filePath: string) => {
                return filePath.includes('enrol/externallib.php');
            });

            const service: MoodleService = {
                name: 'core_role_assign_roles',
                classname: 'core_role_external',
                type: 'write',
                methodname: 'assign_roles',
                classpath: 'enrol/externallib.php',
                description: 'Manual role assignments',
            };

            const resolvedPath = await resolveClass(service, './src/tmp/moodle/v/5.1');
            expect(resolvedPath).toBe('enrol/externallib.php');
        });

    });

});