import { For } from "solid-js";
import Cell from "./Cell";

export default function Row(props: any) {
  return (
    <tr>
      <For each={props.words}>
        {(word: any) => (
          <Cell
            word={word.word}
            color={word.color}
            guessed={word.guessed}
          ></Cell>
        )}
      </For>
    </tr>
  );
}
