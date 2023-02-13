import { For, Show } from "solid-js";

export default function Table(props: any) {
  const response: Response = await fetch("/io/inf.json");
  if (!response.ok) {
    return <h1>Waiting to start game</h1>;
  }
  const inf: any = await response.json();
  // check if inf has property words
  if (!inf.words) {
    return <h1>Waiting to generate words</h1>;
  }
  console.log(inf);
  return (
    <>
      <h1>Experimental Game UI</h1>
      <div id="game-area">
        <table>
          <For each={inf.words}>
            {(word, i) => (
              <Show
                when={i() % 5 === 0}
                fallback={(
                  <Show when={i() % 5 === 4}>
                  </Show>
              )}>
                <tr>
              </Show>
            )}
          </For>
        </table>
      </div>
    </>
  );
}