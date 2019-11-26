import React from 'react';
import ResizablePanels from './components/resizable-panels';

function App() {
  return (
    <ResizablePanels
      kcolor="#e1b12c"
      displayDirection="row"
      width="100%"
      height="800px"
      panelsSize={[40, 60]}
      sizeUnitMeasure="%"
      resizerColor="#353b48"
      resizerSize="30px"
    >
      <div>panel one</div>
      <div>panel two</div>
    </ResizablePanels>
  );
}

export default App;
