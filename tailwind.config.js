/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{astro,html,md,mdx,vue,ts,js}',
        './public/**/*.html',
        './public/src/**/*.js',   // Model Zoo Vue templates — without this their classes get purged
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem'
        },
        extend: {
            fontFamily: {
                'display': ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
                'body': ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
                'mono': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
            colors: {
                brand: {
                    DEFAULT: '#05789e',
                    primary: '#00C0B5',
                    secondary: '#3E5CAD',
                    dark: '#046483',
                    light: '#e6f3f7',
                    teal: '#007E76',   // accessible teal for small text on light (~4.9:1)
                    accent: '#009C94'  // vibrant teal for large headings on light (~3.4:1)
                },
                neutral: {
                    purewhite: '#ffffff',
                    darkestblack: '#1a1a1a',
                    lightgray: '#F3F4F6'
                },
                surface: {
                    dark: '#0B1120',
                    darker: '#060d1b',
                }
            },
            spacing: {
                '128': '32rem',
            },
            zIndex: {
                '-10': '-10',
                '60': '60',
                '70': '70',
            },
            inset: {
                '100': '100%',
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: '#4B5563',
                        fontFamily: '"Atkinson Hyperlegible", system-ui, sans-serif',
                        maxWidth: '70ch',
                        a: {
                            color: '#00C0B5',
                            '&:hover': {
                                color: '#046483',
                            },
                        },
                    },
                },
            },
            animation: {
                'slide-up': 'slideUp 0.6s ease-out forwards',
            },
            keyframes: {
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
