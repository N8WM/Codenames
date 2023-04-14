function cardTypeToColor(type: string, guessed: boolean) {
  if (!guessed) {
    return "#fff";
  }
  switch (type) {
    case "Red":
      return "#a83232";
    case "Blue":
      return "#323ea8";
    case "Civilian":
      return "#a87d32";
    case "Assassin":
      return "#9132a8";
  }
}

export default function Cell(props: {
  word: string;
  color: string;
  guessed: boolean;
}) {
  return (
    <td
      style={{
        "background-color": cardTypeToColor(props.color, props.guessed),
        border: props.guessed ? "none" : "solid 2px #000",
        color: props.guessed ? "#fff" : "#000",
      }}
    >
      {props?.word}
    </td>
  );
}
