import React, { useEffect, useState } from 'react';
import range from 'lodash.range';

import GUI from 'lil-gui';
import Draggable from 'react-draggable';

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

    const [currentnumOfColumns, setnumOfColumns] = useState(numOfColumns);
    const [currentfriendlyWidth, setfriendlyWidth] = useState(friendlyWidth(numOfColumns,width));

    const [currentfirstColumnDelay, setfirstColumnDelay] = useState(firstColumnDelay(numOfColumns,staggeredDelay));



  //const friendlyWidth =
    //Math.round(width / numOfColumns) * numOfColumns;

  //const firstColumnDelay = numOfColumns * staggeredDelay * -1;


  useEffect(() => {
    const gui = new GUI();
    const variantOptions = { Flag: 1 };
    const flagColumns = { Columns: 10 };

    gui.add(variantOptions, 'Flag', { LGBT: 0, Rainbow: 1, Trans: 2, Pan: 3 }).onChange((value) => {
      const variants = ['rainbow', 'rainbow-original', 'trans', 'pan'];
      setCurrentVariant(variants[value]);
    });
    gui.add(flagColumns, 'Columns', 1, 20, 1).onChange((value) => {
        setnumOfColumns(value);
    });

    return () => {
      gui.destroy();
    };
  }, []);

  useEffect(() => {
    setColors(COLORS[currentVariant]);
  }, [currentVariant]);

  useEffect(() => {
    setfriendlyWidth(friendlyWidth(currentnumOfColumns, width));
  }, [currentnumOfColumns, width]);

  useEffect(() => {
    setfirstColumnDelay(firstColumnDelay(currentnumOfColumns, staggeredDelay));
  }, [currentnumOfColumns, staggeredDelay]);

  useEffect(() => {
    setnumOfColumns(currentnumOfColumns);
  }, [currentnumOfColumns]);



  return (
    <Draggable >
    <div
        className={styles.flag}
        style={{
          width: currentfriendlyWidth
        }}
      >
      {range(currentnumOfColumns).map((index) => (
        <div
          key={index}
          className={styles.column}
          style={{
            '--billow': index * billow + 'px',
            background: generateGradientString(colors),
            animationDelay:
              currentfirstColumnDelay + index * staggeredDelay + 'ms',
          }}
        />
      ))}
    </div>
    </Draggable>
  );
}

function friendlyWidth(numOfColumns, width) {
  return Math.round(width / numOfColumns) * numOfColumns;
}

function firstColumnDelay(numOfColumns, staggeredDelay) {
  return numOfColumns * staggeredDelay * -1;
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