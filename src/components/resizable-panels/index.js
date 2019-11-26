import React, { useState, useEffect, useRef, useMemo } from 'react';
import Resizer from './Resizer';

function ResizablePanels (props) {

  /*const [state, setState] = useState({
    panelsSize: props.panelsSize,
    resizing: false
  });*/

  const [ resizing, setResizing ] = useState(false);
  const [ currentPanel, setCurrentPanel ] = useState();
  const [ initialPos, setInitialPos ] = useState();
  const [ displacement, setDisplacement ] = useState();
  const [ panelsSize, setPanelsSize ] = useState(props.panelsSize);

  const resizable = useRef();

  const renderFirst = () => {
    return renderChildren(props.children[0], 0);
  }

  const renderRest = (rest) => {
    return [].concat(
      ...rest.map((children, index) => {
        return [
          renderResizer(index + 1),
          renderChildren(children, index + 1)
        ];
      })
    );
  }

  const renderChildren = (children, index) => {
    return (
      <div
        className="resizable-fragment"
        key={`fragment_` + index}
        style={getStyle(index)}
      >
        {children}
      </div>
    );
  }

  const renderResizer = (index) => {
    return (
      <Resizer
        size={props.resizerSize || '10px'}
        key={`resizer_` + index}
        direction={props.displayDirection}
        onMouseDown={e => startResize(e, index)}
        color={props.resizerColor}
      />
    );
  }

  const displayDirectionIsColumn = () => {
    return props.displayDirection === 'column' ? true : false;
  }

  const getStyle = (index) => {
    // const panelsSize = state.panelsSize || [];
    const panelsSizeLength = panelsSize.length - 1;
    const size = index > panelsSizeLength ? '100%' : panelsSize[index];
    const unitMeasure = props.sizeUnitMeasure || 'px';

    if (displayDirectionIsColumn()) {
      return {
        height: `${size}${unitMeasure}`,
        width: `100%`,
        overflow: 'hidden'
      };
    }

    return {
      height: `100%`,
      width: `${size}${unitMeasure}`,
      overflow: 'hidden'
    };
  }

  const startResize = (e, index) => {
    e.preventDefault();
    console.log('startResizing');
    setResizing(true);
    setCurrentPanel(index);
    setInitialPos(displayDirectionIsColumn() ? e.clientY : e.clientX);
    // setState({
    //   ...state,
    //   resizing: true,
    //   currentPanel: index,
    //   initialPos: displayDirectionIsColumn() ? e.clientY : e.clientX
    // });
  }

  const executeResize = e => {
    console.log(resizing);
    if (resizing) {
      const currentMousePosition = displayDirectionIsColumn()
        ? e.clientY
        : e.clientX;

      const dis = initialPos - currentMousePosition;

      const nextPanelsSize = getNextPanelsSize(dis);
      console.log(nextPanelsSize);

      /*setState({
        ...state,
        initialPos: currentMousePosition,
        panelsSize: nextPanelsSize,
        displacement
      });*/
      setDisplacement(dis);
      setPanelsSize(nextPanelsSize);
      setInitialPos(currentMousePosition);
    }
  };

  const stopResize = () => {
    /*setState({
      ...state,
      resizing: false,
      currentPanel: null,
      displacement: 0
    });*/
    setResizing(false);
    setCurrentPanel(null);
    setDisplacement(0);
  };

  const getCurrentComponentSize = () => {
    const componentSizes = resizable.current.getBoundingClientRect();

    return displayDirectionIsColumn()
      ? componentSizes.height
      : componentSizes.width;
  }

  const getNextPanelsSize = (dis) => {
    const currentPanelsSize = panelsSize;
    const usePercentage = props.sizeUnitMeasure === '%';

    const resizeSize = usePercentage
      ? convertToPercentage(dis)
      : dis;

    const newPanelsSize = currentPanelsSize.map((panelSize, index) => {
      if (index === currentPanel) return panelSize + resizeSize;
      else if (index === currentPanel - 1)
        return panelSize - resizeSize;

      return panelSize;
    });

    return newPanelsSize;
  }

  const convertToPercentage = (dis) => {
    const size = getCurrentComponentSize();

    return (dis * 100) / size;
  }

  useEffect(() => {
    const resiz = resizable.current;
    if(resiz) {
      console.log('addeventlistener');
      resiz.addEventListener(
        'mousemove',
        executeResize
      );
      resiz.addEventListener('mouseup', stopResize);
      resiz.addEventListener('mouseleave', stopResize);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { bkcolor, width, height, displayDirection } = props;
  const rest = props.children.length > 1 ? props.children.slice(1) : [];

  console.log('rendering');
  return  useMemo(() => {
    console.log('in memo');
    return ( <div
      style={{
        width: width,
        height: height,
        background: bkcolor,
        display: 'flex',
        flexDirection: displayDirection || 'row'
      }}
      ref={resizable}
    >
      {renderFirst()}
      {renderRest(rest)}
    </div>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default ResizablePanels;
