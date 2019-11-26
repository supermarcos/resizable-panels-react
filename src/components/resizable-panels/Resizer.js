import React from 'react';

function Resizer (props) {
  const getStyle = () => {
    if (props.direction === 'column') {
      return {
        width: '100%',
        height: props.size,
        background: props.color,
        cursor: 'row-resize'
      };
    }

    return {
      width: props.size,
      height: '100%',
      background: props.color,
      cursor: 'col-resize'
    };
  }

  return <div onMouseDown={props.onMouseDown} style={getStyle()} />;
}

export default Resizer;
