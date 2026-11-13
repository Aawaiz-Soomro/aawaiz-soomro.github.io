import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
uniform vec2 m;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){
  float a = .5, s = 0.;
  for (int i = 0; i < 5; i++) { s += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; }
  return s;
}
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = (gl_FragCoord.xy - .5 * r) / r.y;
  vec2 mp = (m - .5 * r) / r.y;
  float d = length(p - mp);
  float glow = exp(-d * d * 3.);
  float tt = t * .085;

  vec2 q = vec2(fbm(p * 1.1 + tt), fbm(p * 1.1 + vec2(5.2, 1.3) - tt));
  vec2 w = vec2(fbm(p * 1.4 + 3. * q + vec2(1.7, 9.2) + tt * .7), fbm(p * 1.4 + 3. * q + vec2(8.3, 2.8) - tt * .5));
  float f = fbm(p * 1.2 + 3.2 * w + (p - mp) * glow * .35);

  vec3 base = vec3(.071, .082, .110);
  vec3 slate = vec3(.150, .200, .300);
  vec3 mint = vec3(.584, .902, .796);

  vec3 col = mix(base, slate, smoothstep(.3, .85, f));
  col = mix(col, mint, pow(smoothstep(.45, .95, f + glow * .25), 3.) * .42);

  float c = abs(fract(f * 10.) - .5);
  col += mint * smoothstep(.03, .0, c) * (.05 + glow * .16);
  col += mint * glow * .07;

  col *= smoothstep(1.35, .15, length(p * vec2(.75, 1.)));
  col = mix(base, col, smoothstep(.0, .3, uv.y));
  gl_FragColor = vec4(col, 1.);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

/** Slow flowing noise field behind the hero. Follows the pointer; pauses off screen. */
export default function ShaderBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");

    const SCALE = 0.5; // render at half resolution; the noise is soft anyway
    let raf = 0;
    let visible = true;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastPointer = -1e9;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * SCALE));
      canvas.height = Math.max(1, Math.round(height * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouse.tx = mouse.x = canvas.width * 0.68;
      mouse.ty = mouse.y = canvas.height * 0.6;
    };

    const draw = (now: number) => {
      raf = 0;
      // With no pointer around (phones), the light wanders on its own.
      if (now - lastPointer > 2200) {
        mouse.tx = canvas.width * (0.5 + 0.34 * Math.cos(now * 0.00045));
        mouse.ty = canvas.height * (0.55 + 0.28 * Math.sin(now * 0.0007));
      }
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, reduced ? 12 : now / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      lastPointer = performance.now();
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) * SCALE;
      mouse.ty = (rect.height - (e.clientY - rect.top)) * SCALE;
      if (reduced) kick();
    };

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    resize();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className={`h-full w-full ${className}`} />;
}
