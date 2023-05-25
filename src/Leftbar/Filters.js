export default function Filters(props) {
  let availables = [];
  if (props.availables !== undefined) {
    availables = props.availables;
  } else {
    availables = props.listOfFilters;
  }

  return props.listOfFilters.map((filterid) => (
    <li key={filterid}>
      <label
        style={
          availables.includes(filterid) ? { color: "black" } : { color: "grey" }
        }
        className={availables.includes(filterid) ? "usable" : "unusable"}
      >
        <input
          className={props.classname}
          type="checkbox"
          id={filterid}
          onChange={props.onclick}
          disabled={availables.includes(filterid) ? false : true}
        ></input>
        {filterid}
      </label>
    </li>
  ));
}
