const options = [
  { value: "ambient", label: "Ambient" },
  { value: "alternativeRock", label: "Alternative Rock" },
  { value: "avantGarde", label: "Avant Garde" },
  { value: "classical", label: "Classical" },
  { value: "dance", label: "Dance" },
  { value: "hipHop", label: "Hip-Hop" },
  { value: "house", label: "House" },
  { value: "industial", label: "Industrial" },
  { value: "jazz", label: "Jazz" },
  { value: "metal", label: "Metal" },
  { value: "noise", label: "Noise" },
  { value: "pop", label: "Pop" }
];

const customStyles = {
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: 152
  }),
  menu: (provided, state) => ({
    ...provided,
    maxHeight: 152,
    overflow: "auto"
  }),
  container: (provided, state) => ({
    ...provided,
    width: 400
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: state.isSelected ? "grey" : "black",
    padding: 20,
    width: 400
  }),
  // control: () => ({
  //   // none of react-select's styles are passed to <Control />
  //   width: 400,
  //   maxHeight: 200
  // }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  }
};

export { customStyles, options };
