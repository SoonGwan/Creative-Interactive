import { Text } from './text.js';
import { Visual } from './visual.js';
class App {
  constructor() {
    this.setWebgl();

    WebFont.load({
      google: {
        families: ['Hind:700'],
      },
      fontactive: () => {
        this.visual = new Visual();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
      },
    });
  }

  setWebgl() {
    this.renderer = new PIXI.Renderer({
      width: document.body.clientWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolition: window.devicePixelRatio > 1 ? 2 : 1,
      autoDensity: true,
      powerPerformance: 'high-performance',
      backgroundColor: 0xffffff,
    });
    document.body.appendChild(this.renderer.view);

    this.stage = new PIXI.Container();

    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 10;
    blurFilter.autoFit = true;

    const fragSource = `
        precision mediump float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float threshold;
        uniform float mr;
        uniform float mg;
        uniform float mb;
        void main(void) {
            vec4 color = texture2D(uSampler, vTextureCoord);
            vec3 mcolor = vec3(mr,mg,mb);
            if(color.a > threshold) {
                gl_FragColor = vec4(mcolor,1.0);
            } else {
                gl_FragColor = vec4(ver3(0,0),0.0);
            }
        }

    `;

    const uniformsData = {
      threshold: 0.5,
      mr: 0.0 / 255.0,
      mg: 0.0 / 255.0,
      mb: 0.0 / 255.0,
    };
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.renderer.resize(this.stageWidth, this.stageHeight);

    this.visual.show(this.stageWidth, this.stageHeight, this.stage);
  }

  animate(t) {
    requestAnimationFrame(this.animate.bind(this));

    this.visual.animate();
    this.renderer.render(this.stage);
  }
}

window.onload = () => {
  new App();
};
