/** Load the mapping of moodle pix names to fontawesome icon names */
export interface CoreOutputLoadFontawesomeIconSystemMapParams {
    /** The theme to fetch the map for */
    themename: string | null;
}

export type CoreOutputLoadFontawesomeIconSystemMapReturns = Array<{
    /** The component for the icon. */
    component: string | null;
    /** Value to map the icon from. */
    pix: string | null;
    /** Value to map the icon to. */
    to: string | null;
}>;

export type CoreOutputLoadFontawesomeIconSystemMapReturn = CoreOutputLoadFontawesomeIconSystemMapReturns;
export type core_output_load_fontawesome_icon_system_map_returns = CoreOutputLoadFontawesomeIconSystemMapReturns;
