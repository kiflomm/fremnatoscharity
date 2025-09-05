import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 42"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Logo F"
            role="img"
        >
            <text
                x="8"
                y="32"
                fontFamily="Inter, Arial, sans-serif"
                fontWeight="bold"
                fontSize="32"
                fill="currentColor"
                letterSpacing="0"
            >
                F
            </text>
        </svg>
    );
}
