import React, { useEffect, useState } from 'react';
import range from 'lodash.range';

import GUI from 'lil-gui';

import styles from './FlagStyle.module.css';
import { COLORS } from './flags.js';

function PrideFlag({
  variant = 'rainbow-original', // rainbow | rainbow-original | trans | pan
  width = 200,
  numOfColumns = 10,
  staggeredDelay = 100,
  billow = 2
}) {
    const [currentVariant, setCurrentVariant] = useState(variant);
    const [colors, setColors] = useState(COLORS[variant]);

  const friendlyWidth =
    Math.round(width / numOfColumns) * numOfColumns;

  const firstColumnDelay = numOfColumns * staggeredDelay * -1;

  //const ref = useRef()

  useEffect(() => {
    const gui = new GUI();
    const variantOptions = { Flag: 1 };
    gui.add(variantOptions, 'Flag', { LGBT: 0, Rainbow: 1, Trans: 2, Pan: 3 }).onChange((value) => {
      const variants = ['rainbow', 'rainbow-original', 'trans', 'pan'];
      setCurrentVariant(variants[value]);
    });
    return () => {
      gui.destroy();
    };
  }, []);

  useEffect(() => {
    setColors(COLORS[currentVariant]);
  }, [currentVariant]);

  return (
    <div className={styles.flag} style={{ width: friendlyWidth }}>
      {range(numOfColumns).map((index) => (
        <div
          key={index}
          className={styles.column}
          style={{
            '--billow': index * billow + 'px',
            background: generateGradientString(colors),
            animationDelay:
              firstColumnDelay + index * staggeredDelay + 'ms',
          }}
        />
      ))}
    </div>
  );
}

function generateGradientString(colors) {
  const numOfColors = colors.length;
  const segmentHeight = 100 / numOfColors;

  const gradientStops = colors.map((color, index) => {
    const from = index * segmentHeight;
    const to = (index + 1) * segmentHeight;

    return `${color} ${from}% ${to}%`;
  });

  return `linear-gradient(to bottom, ${gradientStops.join(', ')})`;
}

export default PrideFlag;