import { For } from "solid-js";
import Cell from "./Cell";

export default function Row(props: {
  words: { word: string; color: string; guessed: boolean }[];
  isKey: boolean;
}) {
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
