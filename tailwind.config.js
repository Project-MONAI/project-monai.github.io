/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.html',
        './components/**/*.html',
        './assets/css/**/*.css',
        './assets/js/**/*.js',
        './src/**/*.js'
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem'
        },
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#05789e',
                    primary: '#00C0B5',
                    secondary: '#3E5CAD',
                    dark: '#046483',
                    light: '#e6f3f7'
                },
                neutral: {
                    purewhite: '#ffffff',
                    darkestblack: '#1a1a1a',
                    light_gray: '#E5E7EB'
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
                        color: '#5D5D5D',
                        a: {
                            color: '#05789e',
                            '&:hover': {
                                color: '#046483',
                            },
                        },
                    },
                },
            }
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp'),
    ],
}