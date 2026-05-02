/**
 * PixiJS Mock for Jest
 */
export const Application = function() {
  return {
    init: async () => true,
    start: () => {},
    stop: () => {},
    canvas: { id: '', style: { display: '' } },
    stage: { addChild: () => {} },
  };
};

export const Container = function() {
  return {
    addChild: () => {},
    removeChildren: () => {},
    removeChild: () => {},
    scale: { set: () => {} },
    children: [],
    filters: [],
    sortChildren: () => {},
  };
};

export const Graphics = function() {
  return {
    rect: function() { return this; },
    circle: function() { return this; },
    fill: function() { return this; },
    stroke: function() { return this; },
    lineStyle: function() { return this; },
    beginFill: function() { return this; },
    drawRect: function() { return this; },
    drawCircle: function() { return this; },
    endFill: function() { return this; },
    moveTo: function() { return this; },
    lineTo: function() { return this; },
    scale: { set: () => {} },
    alpha: 1,
    x: 0,
    y: 0,
  };
};

export const Sprite = function() {
  return {
    anchor: { set: () => {} },
    x: 0,
    y: 0,
    scale: { x: 1, y: 1, set: () => {} },
    visible: true,
    texture: { frame: new Rectangle(0, 0, 32, 32) },
    addChild: () => {},
  };
};

export const Text = function() {
  return {
    anchor: { set: () => {} },
    x: 0,
    y: 0,
    scale: { x: 1, y: 1, set: () => {} },
    style: {},
    text: '',
  };
};

export const Rectangle = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
};

export const Texture = function(options) {
  this.source = options?.source || {};
  this.frame = options?.frame || new Rectangle(0, 0, 1, 1);
};
Texture.from = () => ({ source: {} });

export const ColorMatrixFilter = function() {
  return {
    hue: () => {},
  };
};

export const NoiseFilter = function() {
  return {};
};

export const AbstractRenderer = {
  defaultOptions: { roundPixels: false }
};

export const Filter = function() {};
