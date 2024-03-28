import { PanelExtensionContext } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

const VAR_NAME = "globalVarSensorGroup";

function ExamplePanel(props: { context: PanelExtensionContext }): JSX.Element {
  const { context } = props;
  const [enumVal, setEnumValue] = useState<string>("front");

  useLayoutEffect(() => {
    context.onRender = (state, done) => {
      if (state.variables && state.variables?.size > 0) {
        // fixme - better to validate values here
        const newVar = (state.variables?.get(VAR_NAME) as string) ?? "front";
        setEnumValue(newVar);
      }
      done();
    };
    context.watch("variables");
  }, [context]);

  // Apply change in value to the context
  useEffect(() => {
    context.setVariable(VAR_NAME, enumVal);
  }, [enumVal]);

  return (
    <div style={{ padding: "1rem" }}>
      <select
        onChange={(ev) => {
          const val = ev.target.value;
          setEnumValue(val);
        }}
        value={enumVal}
      >
        <option>front</option>
        <option>rear</option>
        <option>left</option>
        <option>right</option>
      </select>
    </div>
  );
}

export function initExamplePanel(context: PanelExtensionContext): () => void {
  ReactDOM.render(<ExamplePanel context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
