export const PRESETS = {
  neonCyan: {
    dotsOptions: {
      type: 'classy-rounded',
      gradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#00ffff' },
          { offset: 1, color: '#8a2be2' },
        ],
      },
    },
    backgroundOptions: {
      color: '#0b0d19',
      gradient: null,
    },
    cornersSquareOptions: {
      type: 'rounded',
    },
    cornersDotOptions: {
      type: 'dot',
    },
  },
  midnightViolet: {
    dotsOptions: {
      type: 'extra-rounded',
      gradient: {
        type: 'linear',
        rotation: 90,
        colorStops: [
          { offset: 0, color: '#8a2be2' },
          { offset: 1, color: '#da70d6' },
        ],
      },
    },
    backgroundOptions: {
      color: '#07050d',
      gradient: null,
    },
    cornersSquareOptions: {
      type: 'dot',
    },
    cornersDotOptions: {
      type: 'dot',
    },
  },
  sunsetGlow: {
    dotsOptions: {
      type: 'classy',
      gradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#ff3d00' },
          { offset: 1, color: '#ffea00' },
        ],
      },
    },
    backgroundOptions: {
      color: '#0f0500',
      gradient: null,
    },
    cornersSquareOptions: {
      type: 'rounded',
    },
    cornersDotOptions: {
      type: 'square',
    },
  },
  forestEmerald: {
    dotsOptions: {
      type: 'rounded',
      gradient: {
        type: 'linear',
        rotation: 0,
        colorStops: [
          { offset: 0, color: '#00e676' },
          { offset: 1, color: '#00b0ff' },
        ],
      },
    },
    backgroundOptions: {
      color: '#02120b',
      gradient: null,
    },
    cornersSquareOptions: {
      type: 'rounded',
    },
    cornersDotOptions: {
      type: 'dot',
    },
  },
  monochrome: {
    dotsOptions: {
      type: 'square',
      color: '#000000',
      gradient: null,
    },
    backgroundOptions: {
      color: '#ffffff',
      gradient: null,
    },
    cornersSquareOptions: {
      type: 'square',
    },
    cornersDotOptions: {
      type: 'square',
    },
  },
};

export const defaultDesignConfig = {
  width: 280,
  height: 280,
  margin: 12,
  dotsOptions: {
    type: 'classy-rounded',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#00ffff' },
        { offset: 1, color: '#8a2be2' },
      ],
    },
  },
  backgroundOptions: {
    color: '#0b0d19',
    gradient: null,
  },
  cornersSquareOptions: {
    type: 'rounded',
  },
  cornersDotOptions: {
    type: 'dot',
  },
  image: null,
  imageOptions: {
    crossOrigin: 'anonymous',
    hideBackgroundDots: true,
    imageSize: 0.22,
    margin: 4,
  },
};
