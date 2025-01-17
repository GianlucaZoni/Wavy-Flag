import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import range from 'lodash.range';

import GUI from 'lil-gui';
import Draggable from 'react-draggable';

import styles from './FlagStyle.module.css';
import { COLORS } from './flags.js';

function PrideFlag({
  variant = 'italian', // rainbow | rainbow-original | trans | pan | italian
  orientation = 'vertical', // horizontal | vertical
  width = 200,
  numOfColumns = 10,
  staggeredDelay = 100,
  billow = 2
}) {
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [colors, setColors] = useState(COLORS[variant]);

  const draggableRef = useRef(null);

  const [currentnumOfColumns, setnumOfColumns] = useState(numOfColumns);
  const [currentstaggeredDelay, setstaggeredDelay] = useState(staggeredDelay);
  const [currentbillow, setbillow] = useState(billow);

  const currentfriendlyWidth = useMemo(() => friendlyWidth(currentnumOfColumns, width), [currentnumOfColumns, width]);
  const currentfirstColumnDelay = useMemo(() => firstColumnDelay(currentnumOfColumns, currentstaggeredDelay), [currentnumOfColumns, currentstaggeredDelay]);

  const memoizedGenerateGradientString = useCallback(() => generateGradientString(colors,orientation), [colors]);

  useEffect(() => {
    const gui = new GUI();
    const variantOptions = { Flag: 1 };
    const flagColumns = { Columns: 10 };
    const stagDelay = { Delay: 100 };
    const flagBillow = { Billow: 2 };

    gui.add(variantOptions, 'Flag', { LGBT: 0, Rainbow: 1, Trans: 2, Pan: 3, Italy: 4 }).onChange((value) => {
      const variants = ['rainbow', 'rainbow-original', 'trans', 'pan', 'italian'];
      setCurrentVariant(variants[value]);
    });
    gui.add(flagColumns, 'Columns', 1, 20, 1).onChange((value) => {
      setnumOfColumns(value);
    });
    gui.add(stagDelay, 'Delay', 0, 200, 1).onChange((value) => {
        setstaggeredDelay(value);
    });
    gui.add(flagBillow, 'Billow', 0, 10).onChange((value) => {
        setbillow(value);
    });

    return () => {
      gui.destroy();
    };
  }, []);

  useEffect(() => {
    setColors(COLORS[currentVariant]);
  }, [currentVariant]);

  useEffect(() => {
    setbillow(currentbillow);
  }, [currentbillow]);

  return (
    <Draggable key={currentnumOfColumns} nodeRef={draggableRef}>
      <div
        ref={draggableRef}
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
              '--billow': index * currentbillow + 'px',
              background: memoizedGenerateGradientString(),
              animationDelay:
                currentfirstColumnDelay + index * currentstaggeredDelay + 'ms',
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

function generateGradientString(colors, orientation) {
  const numOfColors = colors.length;
  const segmentHeight = 100 / numOfColors;

  const gradientStops = colors.map((color, index) => {
    const from = index * segmentHeight;
    const to = (index + 1) * segmentHeight;

    return `${color} ${from}% ${to}%`;
  });

  return orientation === 'vertical'
    ? `linear-gradient(to right, ${gradientStops.join(', ')})`
    : `linear-gradient(to bottom, ${gradientStops.join(', ')})`;
}

export default PrideFlag;