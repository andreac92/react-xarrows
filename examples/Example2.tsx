import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { line, box, point } from "./types";
import Xarrows from "../src/Xarrow";

const canvasStyle = {
  width: "100%",
  height: "40vh",
  background: "white",
  overflow: "auto",
  display: "flex",
  position: "relative"
  // overflowY: "scroll",
  // overflowX: "hidden"
};

const boxContainerStyle = {
  position: "relative",
  overflow: "scroll",
  width: "120%",
  height: "140%",
  background: "white",
  color: "black",
  border: "black solid 1px"
};

const boxStyle = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "40px",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const Box: React.FC = props => {
  const [lastPoint, setLastPoint] = useState<point>({ x: 0, y: 0 });

  const handlDragStart = (e: React.DragEvent) => {
    setLastPoint({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent, boxId: string) => {
    let i = props.boxes.findIndex(box => box.id === boxId);
    let newBoxes = [...props.boxes];
    let newX = newBoxes[i].x + e.clientX - lastPoint.x,
      newY = newBoxes[i].y + e.clientY - lastPoint.y;
    if (newX < 0 || newY < 0) return;
    newBoxes[i].x = newX;
    newBoxes[i].y = newY;
    props.setBoxes(newBoxes);
  };

  return (
    <div
      ref={props.box.ref}
      style={{ ...boxStyle, left: props.box.x, top: props.box.y }}
      onDragStart={e => handlDragStart(e)}
      onDragEnd={e => handleDragEnd(e, props.box.id)}
      id={props.box.id}
      draggable
    >
      {props.box.id}
    </div>
  );
};

const Example2: React.FC = () => {
  const [boxes, setBoxes] = useState<box[]>([
    //this initiazid values are precentage - next it will be pixels
    { id: "box1", x: 20, y: 20, ref: useRef(null) },
    { id: "box2", x: 20, y: 80, ref: useRef(null) }
  ]);

  const [boxes2, setBoxes2] = useState<box[]>([
    { id: "box3", x: 20, y: 20, ref: useRef(null) },
    { id: "box4", x: 20, y: 80, ref: useRef(null) }
  ]);

  const [lines, setLines] = useState<line[]>([
    { from: "box1", to: "box4" }
    // { from: "box3", to: "box2" }
  ]);
  const boxContainerRef = useRef(null); //boxContainerRef
  const boxContainer2Ref = useRef(null); //boxContainerRef

  const getRefById = Id => {
    var ref;
    [...boxes, ...boxes2].forEach(box => {
      if (box.id === Id) ref = box.ref;
    });
    return ref;
  };

  useEffect(() => {
    let { scrollHeight: h1, scrollWidth: w1 } = boxContainerRef.current;
    let { scrollHeight: h2, scrollWidth: w2 } = boxContainer2Ref.current;
    setBoxes(boxes => boxes.map(box => ({ ...box, x: 0.01 * box.x * w1, y: 0.01 * box.y * h1 })));
    setBoxes2(boxes => boxes.map(box => ({ ...box, x: 0.01 * box.x * w2, y: 0.01 * box.y * h2 })));
  }, []);

  return (
    <React.Fragment>
      <h3>
        <u>Example2:</u>
      </h3>

      <p>
        {" "}
        works perfectly no matter the parent-child relationship between the Xarrow and the source
        and target.
      </p>
      <div style={canvasStyle} id="canvas">
        <div ref={boxContainerRef} style={boxContainerStyle} id="boxContainer1">
          {boxes.map((box, i) => (
            <Box key={i} box={box} boxes={boxes} setBoxes={setBoxes} />
          ))}
        </div>
        <div ref={boxContainer2Ref} style={boxContainerStyle} id="boxContainer2">
          {boxes2.map((box, i) => (
            <Box key={i} box={box} boxes={boxes2} setBoxes={setBoxes2} />
          ))}
        </div>
        {lines.map((line, i) => (
          <Xarrows
            key={i}
            start={getRefById(line.from)}
            end={getRefById(line.to)}
            monitorDOMchanges={true}
          />
        ))}
      </div>
      <p>
        {" "}
        set <code>monitorDOMchanges </code>
        property to <code>true</code> to enable this behavior - this will add eventListeners to the
        DOM and will trigger update when needed(expereintial).
        <br /> however - make sure you put the Xarrow component as brother of the common ancestor of
        'start' component and 'end' component <b>so the Xarrow will not rerender when not needed</b>
        .{" "}
      </p>
    </React.Fragment>
  );
};

export default Example2;
