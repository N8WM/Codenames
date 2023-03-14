import { For } from "solid-js";
import Cell from "./Cell";

export default function Row(props: any) {
  return (
    <tr>
      <For each={props.words}>
        {(word: any) => (
          <Cell
            word={props.isKey ? "" : word.word}
            color={word.color}
            guessed={props.isKey ? true : word.guessed}
          ></Cell>
        )}
      </For>
    </tr>
  );
}
