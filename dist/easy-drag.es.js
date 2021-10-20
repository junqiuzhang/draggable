var diffVector = function(vector1, vector2) {
  var x = vector2[0] - vector1[0];
  var y = vector2[1] - vector1[1];
  return [x, y];
};
var formatVector = function(vector, range) {
  var x = vector[0];
  var y = vector[1];
  x = Math.max(x, range[2]);
  x = Math.min(x, range[3]);
  y = Math.max(y, range[0]);
  y = Math.min(y, range[1]);
  return [x, y];
};
var setTranslatePosition = function(transform, vector) {
  return "translate3d(" + vector[0] + "px, " + vector[1] + "px, 0px) " + transform.replace("none", "");
};
const enableDrag = (element, options) => {
  let { outerElement, innerElement, onDragStart, onDrag, onDragEnd } = options != null ? options : {};
  let startPosition = null;
  let startVectorRange = null;
  let startTransform = "";
  outerElement = outerElement != null ? outerElement : document.body;
  element = element;
  innerElement = innerElement != null ? innerElement : element;
  const translate = (v) => {
    element.style.transform = setTranslatePosition(startTransform, v);
  };
  const onMouseDown = (e) => {
    e.stopPropagation();
    startPosition = [e.pageX, e.pageY];
    if (outerElement && element && innerElement) {
      const outerElementRect = outerElement.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      startVectorRange = [
        outerElementRect.top - elementRect.top,
        outerElementRect.bottom - elementRect.bottom,
        outerElementRect.left - elementRect.left,
        outerElementRect.right - elementRect.right
      ];
      startTransform = window.getComputedStyle(element).transform;
    }
    typeof onDragStart === "function" && onDragStart();
  };
  const onMouseMove = (e) => {
    if (startPosition && startVectorRange) {
      const currentPosition = [e.pageX, e.pageY];
      const moveVector = diffVector(startPosition, currentPosition);
      const formattedVector = formatVector(moveVector, startVectorRange);
      translate(formattedVector);
      typeof onDrag === "function" && onDrag(formattedVector);
    }
  };
  const onMouseUp = (e) => {
    if (startPosition && startVectorRange) {
      typeof onDragEnd === "function" && onDragEnd();
    }
    startPosition = null;
  };
  const addEventListener = () => {
    if (innerElement) {
      innerElement.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };
  const removeEventListener = () => {
    if (innerElement) {
      innerElement.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  };
  addEventListener();
  return removeEventListener;
};
export { enableDrag as default };
