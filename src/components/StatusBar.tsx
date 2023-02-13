import { createSignal } from "solid-js";

export default function StatusBar(props: any) {
  return (
    <>
      <div id="turn">
        <b>Turn:&emsp;</b>
        {"Red" /* placeholder */}
      </div>
      <div id="clue">
        <b>Clue:&emsp;</b>
        {props.state?.turns[props.state.turns.length - 1]?.clue ?? "Pending"}
        &nbsp; &#91;
        {props.state?.turns[props.state.turns.length - 1]?.clue_num ??
          "Pending"}
        &#93;
      </div>
    </>
  );
}
