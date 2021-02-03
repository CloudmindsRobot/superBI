function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

export  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 1
    } : null;
  }
  
  export function isRGBColor(colorString) {
    colorString = colorString.trim();
      return colorString.startsWith("rgb");
  }

  export function rgbColorString2Object(rgbColorString) {
    rgbColorString = rgbColorString.trim();
      if(!isRGBColor(rgbColorString)) {
          throw new Error("param color must start width rgb!")
      }

      const regx = /^rgba?\(\s*(\d{0,3})\s*\,\s*(\d{0,3})\s*\,\s*(\d{0,3})\s*\)$|^rgba?\(\s*(\d{0,3})\s*\,\s*(\d{0,3})\s*\,\s*(\d{0,3})\s*\,\s*(0\.\d+)\s*\)$/;


      const matched = rgbColorString.match(regx);
      if(!matched) {
          return null;
      }


      let [r, g, b, r1, g1, b1, alpha] = matched.slice(1)
      if(!alpha) {
        return {
            r: parseInt(r),
            g: parseInt(g),
            b: parseInt(b),
            a: 1
        }
      }

      return {
        r: parseInt(r1),
        g: parseInt(g1),
        b: parseInt(b1),
        a: parseFloat(alpha)
    }

  }

  export const toRGBAColorString = function(color, alpha) {
    const {r,g,b,a} = color;
    return `rgba(${r},${g},${b},${alpha || a})`;
}