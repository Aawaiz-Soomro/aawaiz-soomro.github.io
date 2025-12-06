// Ayu Mirage (Dark Theme)
export const DARK_THEME = {
    bg: '#1f2430',
    panel: '#232a36',
    border: '#2b3240',
    text: '#cbccc6',
    subtext: '#828997',
    accents: ['#59c2ff', '#bae67e', '#ffcc66', '#f28779', '#d4bfff'],
    mouseGlow: 'rgba(89,194,255,0.15)', // Blue glow for dark mode
}

// Cloud (Light Theme)
export const LIGHT_THEME = {
    bg: '#f1f1f1',
    panel: '#fafbfc',
    border: '#9e9fa0',
    text: '#454545',
    subtext: '#5a5a5a',
    accents: ['#008abd', '#678f03', '#cc6d00', '#d0372d', '#7d57c2'],
    mouseGlow: 'rgba(255, 255, 255, 1)', // White glow for light mode

}

export const THEME = DARK_THEME; // Default export for compatibility

// Helper shades for inline styles
export const styles = {
    panel: { backgroundColor: THEME.panel, border: `1px solid ${THEME.border}` },
    link: { color: THEME.accents[0] },
    sub: { color: THEME.subtext },
}