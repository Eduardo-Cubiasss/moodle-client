/** Toggle showinactivitychooser for a tool type in a course */
export interface ModLtiToggleShowinactivitychooserParams {
    /** Tool type ID */
    tooltypeid: number | null;
    /** Course ID */
    courseid: number | null;
    /** Show in activity chooser */
    showinactivitychooser: boolean | null;
}

/** Success */
export type ModLtiToggleShowinactivitychooserReturns = boolean | null;

export type ModLtiToggleShowinactivitychooserReturn = ModLtiToggleShowinactivitychooserReturns;
export type mod_lti_toggle_showinactivitychooser_returns = ModLtiToggleShowinactivitychooserReturns;
