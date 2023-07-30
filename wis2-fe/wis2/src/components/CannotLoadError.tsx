
type Props = {
  text:string
}

function CannotLoadError({text}: Props) {
  return (
    <div id="loadError">
      <h4>Chyba: nepodarilo sa načítať {text}</h4>
	  </div>
  );
}

export default CannotLoadError;