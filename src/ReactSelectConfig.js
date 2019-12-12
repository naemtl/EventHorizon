const options = [
  { value: "ambient", label: "Ambient" },
  { value: "alternativerock", label: "Alternative Rock" },
  { value: "avantgarde", label: "Avant Garde" },
  { value: "classical", label: "Classical" },
  { value: "blackmetal", label: "Black Metal" },
  { value: "blues", label: "Blues" },
  { value: "country", label: "Country" },
  { value: "dance", label: "Dance" },
  { value: "deathmetal", label: "Death Metal" },
  { value: "doommetal", label: "Doom Metal" },
  { value: "folk", label: "Folk" },
  { value: "folk", label: "Folk" },
  { value: "grime", label: "Grime" },
  { value: "grunge", label: "grunge" },
  { value: "hipHop", label: "Hip-Hop" },
  { value: "house", label: "House" },
  { value: "industrial", label: "Industrial" },
  { value: "jazz", label: "Jazz" },
  { value: "metal", label: "Metal" },
  { value: "newAge", label: "New Age" },
  { value: "newwave", label: "New Wave" },
  { value: "noise", label: "Noise" },
  { value: "pop", label: "Pop" },
  { value: "postpunk", label: "Post Punk" },
  { value: "punk", label: "Punk" },
  { value: "rave", label: "Rave" },
  { value: "rock", label: "Rock" },
  { value: "rnb", label: "R&B" },
  { value: "soul", label: "Soul" },
  { value: "synthpop", label: "Synth Pop" },
  { value: "techno", label: "Techno" }
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
