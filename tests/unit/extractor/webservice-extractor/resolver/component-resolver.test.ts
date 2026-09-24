import {
    determineStrategy,
    resolverComponent,
    clearComponentCache
} from '../../../../../src/generator/extractor/resolver/component-resolver';
import { StrategyConfig } from '../../../../../src/generator/extractor/interfaces/component-resolver.interfaces';
import * as VersionResolver from '../../../../../src/generator/extractor/resolver/version-resolver';
import * as JsonResolver from '../../../../../src/generator/extractor/resolver/component/json-component-resolver';
import * as ClassResolver from '../../../../../src/generator/extractor/resolver/component/class-component-resolver';
import * as LegacyResolver from '../../../../../src/generator/extractor/resolver/component/legacy-moodlelib-resolver';
import * as SubsystemResolver from '../../../../../src/generator/extractor/resolver/component/subsystem-resolver';
import * as Scanner from '../../../../../src/generator/extractor/scanner/scanner';

vi.mock('../../../../../src/generator/extractor/resolver/version-resolver');
vi.mock('../../../../../src/generator/extractor/resolver/component/json-component-resolver');
vi.mock('../../../../../src/generator/extractor/resolver/component/class-component-resolver');
vi.mock('../../../../../src/generator/extractor/resolver/component/legacy-moodlelib-resolver');
vi.mock('../../../../../src/generator/extractor/resolver/component/subsystem-resolver');
vi.mock('../../../../../src/generator/extractor/scanner/scanner');

describe('Unit Test: component-resolver (Phase 1 & Phase 2 Orchestration & Version Persistence)', () => {

    beforeEach(() => {
        clearComponentCache();
        (SubsystemResolver.resolveJsonSubsystems as any).mockResolvedValue(new Map([['core', 'lib'], ['user', 'user']]));
        (SubsystemResolver.resolveClassSubsystems as any).mockResolvedValue(new Map([['core', 'lib'], ['group', 'group']]));
        (SubsystemResolver.resolveLegacySubsystems as any).mockReturnValue(new Map([['core', 'lib']]));
        (Scanner.findFiles as any).mockResolvedValue([]);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('determineStrategy', () => {

        describe('Moodle >= 3.8 (Strategy 1: lib/components.json)', () => {
            it('should select lib/components.json with requiresTrimming: false for version 3.8', () => {
                const config: StrategyConfig = determineStrategy('3.8');
                expect(config).toEqual({
                    target: 'lib/components.json',
                    requiresTrimming: false,
                    type: 'json'
                });
            });

            it('should select lib/components.json for version 3.11.2', () => {
                const config: StrategyConfig = determineStrategy('3.11.2');
                expect(config).toEqual({
                    target: 'lib/components.json',
                    requiresTrimming: false,
                    type: 'json'
                });
            });

            it('should select lib/components.json for version 4.5', () => {
                const config: StrategyConfig = determineStrategy('4.5');
                expect(config).toEqual({
                    target: 'lib/components.json',
                    requiresTrimming: false,
                    type: 'json'
                });
            });

            it('should select lib/components.json for version 5.2.2', () => {
                const config: StrategyConfig = determineStrategy('5.2.2');
                expect(config).toEqual({
                    target: 'lib/components.json',
                    requiresTrimming: false,
                    type: 'json'
                });
            });
        });

        describe('Moodle 2.6 - 3.7 (Strategy 2: lib/classes/component.php)', () => {
            it('should select lib/classes/component.php with requiresTrimming: false for version 2.6', () => {
                const config: StrategyConfig = determineStrategy('2.6');
                expect(config).toEqual({
                    target: 'lib/classes/component.php',
                    requiresTrimming: false,
                    type: 'ast'
                });
            });

            it('should select lib/classes/component.php for version 3.0', () => {
                const config: StrategyConfig = determineStrategy('3.0.0');
                expect(config).toEqual({
                    target: 'lib/classes/component.php',
                    requiresTrimming: false,
                    type: 'ast'
                });
            });

            it('should select lib/classes/component.php for version 3.7.9', () => {
                const config: StrategyConfig = determineStrategy('3.7.9');
                expect(config).toEqual({
                    target: 'lib/classes/component.php',
                    requiresTrimming: false,
                    type: 'ast'
                });
            });
        });

        describe('Moodle 2.0 - 2.5 (Strategy 3: lib/moodlelib.php with AST trimming)', () => {
            it('should select lib/moodlelib.php with requiresTrimming: true for version 2.0', () => {
                const config: StrategyConfig = determineStrategy('2.0');
                expect(config).toEqual({
                    target: 'lib/moodlelib.php',
                    requiresTrimming: true,
                    type: 'trimmed-ast'
                });
            });

            it('should select lib/moodlelib.php for version 2.0.10', () => {
                const config: StrategyConfig = determineStrategy('2.0.10');
                expect(config).toEqual({
                    target: 'lib/moodlelib.php',
                    requiresTrimming: true,
                    type: 'trimmed-ast'
                });
            });

            it('should select lib/moodlelib.php for version 2.5.9', () => {
                const config: StrategyConfig = determineStrategy('2.5.9');
                expect(config).toEqual({
                    target: 'lib/moodlelib.php',
                    requiresTrimming: true,
                    type: 'trimmed-ast'
                });
            });
        });

        describe('Error Handling & Boundary Conditions', () => {
            it('should throw error for invalid version string formats', () => {
                expect(() => determineStrategy('invalid-version')).toThrow(
                    /Invalid version format/
                );
                expect(() => determineStrategy('')).toThrow(
                    /Invalid version format/
                );
            });
        });

    });

    describe('resolverComponent (Routing & Strategy Delegation)', () => {

        it('should resolve version and delegate to json-component-resolver for Moodle >= 3.8', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockPlugintypes = new Map([['mod', 'mod']]);
            (VersionResolver.resolveVersion as any).mockResolvedValue('4.5.0');
            (JsonResolver.resolveJsonComponents as any).mockResolvedValue(mockPlugintypes);

            const result = await resolverComponent(moodlePath);

            expect(VersionResolver.resolveVersion).toHaveBeenCalledWith(moodlePath);
            expect(JsonResolver.resolveJsonComponents).toHaveBeenCalledWith(moodlePath);
            expect(result.plugintypes).toBe(mockPlugintypes);
            expect(result.subsystems.get('core')).toBe('lib');
        });

        it('should resolve version and delegate to class-component-resolver for Moodle 2.6 - 3.7', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockPlugintypes = new Map([['mod', 'mod']]);
            (VersionResolver.resolveVersion as any).mockResolvedValue('3.7.2');
            (ClassResolver.resolveClassComponents as any).mockResolvedValue(mockPlugintypes);

            const result = await resolverComponent(moodlePath);

            expect(VersionResolver.resolveVersion).toHaveBeenCalledWith(moodlePath);
            expect(ClassResolver.resolveClassComponents).toHaveBeenCalledWith(moodlePath);
            expect(result.plugintypes).toBe(mockPlugintypes);
            expect(result.subsystems.get('group')).toBe('group');
        });

        it('should resolve version and delegate to legacy-moodlelib-resolver for Moodle 2.0 - 2.5', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockPlugintypes = new Map([['auth', 'auth']]);
            (VersionResolver.resolveVersion as any).mockResolvedValue('2.0.10');
            (LegacyResolver.resolveLegacyMoodlelibComponents as any).mockResolvedValue(mockPlugintypes);

            const result = await resolverComponent(moodlePath);

            expect(VersionResolver.resolveVersion).toHaveBeenCalledWith(moodlePath);
            expect(LegacyResolver.resolveLegacyMoodlelibComponents).toHaveBeenCalledWith(moodlePath);
            expect(result.plugintypes).toBe(mockPlugintypes);
            expect(result.subsystems.get('core')).toBe('lib');
        });

    });

    describe('Version-Level Persistence & Caching', () => {

        it('should persist and reuse component map for the same version without re-resolving', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockPlugintypes = new Map([['mod', 'mod']]);
            (VersionResolver.resolveVersion as any).mockResolvedValue('4.5.0');
            (JsonResolver.resolveJsonComponents as any).mockResolvedValue(mockPlugintypes);

            const firstResult = await resolverComponent(moodlePath);
            const secondResult = await resolverComponent(moodlePath);

            expect(firstResult).toBe(secondResult);
            expect(JsonResolver.resolveJsonComponents).toHaveBeenCalledTimes(1);
        });

        it('should maintain independent persistent maps when processing multiple versions sequentially', async () => {
            const moodle37 = './moodle/v/3.7';
            const moodle45 = './moodle/v/4.5';
            const moodle20 = './moodle/v/2.0';

            const plug37 = new Map([['mod', 'mod']]);
            const plug45 = new Map([['aiplacement', 'ai/placement']]);
            const plug20 = new Map([['report', 'admin/report']]);

            (VersionResolver.resolveVersion as any).mockImplementation((path: string) => {
                if (path.includes('3.7')) {
                    return Promise.resolve('3.7.2');
                }
                if (path.includes('4.5')) {
                    return Promise.resolve('4.5.0');
                }
                return Promise.resolve('2.0.10');
            });

            (ClassResolver.resolveClassComponents as any).mockResolvedValue(plug37);
            (JsonResolver.resolveJsonComponents as any).mockResolvedValue(plug45);
            (LegacyResolver.resolveLegacyMoodlelibComponents as any).mockResolvedValue(plug20);

            const res37 = await resolverComponent(moodle37);
            const res45 = await resolverComponent(moodle45);
            const res20 = await resolverComponent(moodle20);

            expect(res37.plugintypes.get('mod')).toBe('mod');
            expect(res45.plugintypes.get('aiplacement')).toBe('ai/placement');
            expect(res20.plugintypes.get('report')).toBe('admin/report');

            const reRes37 = await resolverComponent(moodle37);
            const reRes45 = await resolverComponent(moodle45);

            expect(reRes37).toBe(res37);
            expect(reRes45).toBe(res45);
            expect(ClassResolver.resolveClassComponents).toHaveBeenCalledTimes(1);
            expect(JsonResolver.resolveJsonComponents).toHaveBeenCalledTimes(1);
            expect(LegacyResolver.resolveLegacyMoodlelibComponents).toHaveBeenCalledTimes(1);
        });

        it('should allow clearing cache for a specific version or completely', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockPlugintypes = new Map([['mod', 'mod']]);
            (VersionResolver.resolveVersion as any).mockResolvedValue('4.5.0');
            (JsonResolver.resolveJsonComponents as any).mockResolvedValue(mockPlugintypes);

            await resolverComponent(moodlePath);
            expect(JsonResolver.resolveJsonComponents).toHaveBeenCalledTimes(1);

            clearComponentCache('4.5.0');

            await resolverComponent(moodlePath);
            expect(JsonResolver.resolveJsonComponents).toHaveBeenCalledTimes(2);

            clearComponentCache();

            await resolverComponent(moodlePath);
            expect(JsonResolver.resolveJsonComponents).toHaveBeenCalledTimes(3);
        });

    });

});
