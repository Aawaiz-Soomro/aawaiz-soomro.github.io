/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*&format=webp' {
    const src: string;
    export default src;
}

declare module '*&as=metadata' {
    const src: { src: string; width: number; height: number };
    export default src;
}

declare module '*?w=600&format=webp' {
    const src: string;
    export default src;
}

declare module '*&quality=75' {
    const src: string;
    export default src;
}