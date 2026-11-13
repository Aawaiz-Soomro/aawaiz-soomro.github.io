import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

/*
 * The one background for the whole site: a few soft forms pressed up out of
 * the page, slowly merging and separating. They are the same colour as the
 * ground, lit from one side, with a faint tint on the lit edge that shifts
 * through the accent colours as the page scrolls. Scrolling also moves the
 * forms along, and they lean toward the pointer.
 */
const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
uniform vec3 tint;

float blob(vec2 p, vec2 c, float rad){ vec2 d = p - c; return exp(-dot(d, d) / (rad * rad)); }

float height(vec2 p){
  float a = r.x / r.y;
  float f = 0.;
  f += blob(p, vec2(a * (.26 * sin(t * .9) - .16), .20 * cos(t * .7) + .16), .36);
  f += blob(p, vec2(a * (.30 * cos(t * .6 + 1.3) + .14), .24 * sin(t * .8 + .6) - .08), .30);
  f += blob(p, vec2(a * (.22 * sin(t * 1.1 + 2.4) + .02), .30 * cos(t * .5 + 2.) + .02), .24);
  f += blob(p, vec2(a * (.34 * cos(t * .4 + 4.) - .05), .34 * sin(t * .6 + 3.1) - .22), .20);
  f += blob(p, m, .16) * .55;
  return smoothstep(.42, 1.05, f);
}

void main(){
  vec2 p = (gl_FragCoord.xy - .5 * r) / r.y;
  float e = .004;
  float h = height(p);
  vec2 g = vec2(height(p + vec2(e, 0.)) - height(p - vec2(e, 0.)), height(p + vec2(0., e)) - height(p - vec2(0., e))) / (2. * e);
  vec3 n = normalize(vec3(-g * .11, 1.));
  vec3 L = normalize(vec3(-.55, .65, .52));
  float lit = dot(n, L) - L.z;

  vec3 base = vec3(.071, .082, .110);
  vec3 col = base * (1. + h * .28);
  col += vec3(.20, .23, .30) * max(lit, 0.) * 1.5;
  col -= vec3(.05, .06, .08) * max(-lit, 0.) * 1.6;
  col += tint * max(lit, 0.) * .55;
  col += tint * h * .022;
  gl_FragColor = vec4(col, 1.);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

// Ayu Mirage accents, in the order the sections use them.
const TINTS = [
  [0.584, 0.902, 0.796],
  [0.831, 0.749, 1.0],
  [1.0, 0.8, 0.4],
  [0.451, 0.816, 1.0],
  [0.584, 0.902, 0.796],
];

export default function Backdrop() {
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
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uR = u("r");
    const uT = u("t");
    const uM = u("m");
    const uTint = u("tint");

    const SCALE = 0.5;
    let raf = 0;
    let scrollEase = window.scrollY;
    const mouse = { x: 0.3, y: 0.2, tx: 0.3, ty: 0.2 };
    let lastPointer = -1e9;

    const resize = () => {
      canvas.width = Math.max(1, Math.round(window.innerWidth * SCALE));
      canvas.height = Math.max(1, Math.round(window.innerHeight * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      raf = 0;
      const vh = window.innerHeight;
      scrollEase += (window.scrollY - scrollEase) * 0.08;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const progress = Math.min(0.9999, Math.max(0, scrollEase / max)) * (TINTS.length - 1);
      const i = Math.floor(progress);
      const k = progress - i;
      const tint = TINTS[i].map((c, j) => c + (TINTS[i + 1][j] - c) * k);

      // Without a pointer the extra form drifts off to the side.
      if (now - lastPointer > 2500) {
        mouse.tx = 0.9;
        mouse.ty = 0.9;
      }
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (reduced ? 20 : now * 0.00022) + (scrollEase / vh) * 0.55);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform3f(uTint, tint[0], tint[1], tint[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastPointer = performance.now();
      mouse.tx = (e.clientX - window.innerWidth / 2) / window.innerHeight;
      mouse.ty = (window.innerHeight / 2 - e.clientY) / window.innerHeight;
    };
    const onResize = () => {
      resize();
      kick();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", kick, { passive: true });
    document.addEventListener("visibilitychange", kick);
    resize();
    kick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
