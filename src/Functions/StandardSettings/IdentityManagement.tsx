export const chooseIdentity = (identities, dispatch, index) => {
  const updatedIdentities = identities.map((identity, idx) => ({
    ...identity,
    choosed: idx === index,
  }));
  dispatch({ type: "SET_DATA_IDENTITIES", payload: updatedIdentities });
};

export const addIdentity = (identities, setActiveIndex, setIdentities) => {
  const newIndex = identities.length;
  const updatedIdentities = [
    ...identities.map((identity) => ({ ...identity, choosed: false })),
    {
      selectedLocation: null,
      selectedPerson: null,
      choosed: true,
      formData: {
        name: "",
        manno: "",
        phone: "",
        email: "",
      },
    },
  ];
  setActiveIndex(newIndex);
  setIdentities(updatedIdentities);
};

export const toggleActiveIndex = (
  currentActiveIndex,
  index,
  setActiveIndex
) => {
  const newActiveIndex = currentActiveIndex === index ? null : index;
  setActiveIndex(newActiveIndex);
};

export const collapseAllIdentities = (
  identities,
  setActiveIndex,
  dispatch,
  performDispatch
) => {
  setActiveIndex(null);
  performDispatch &&
    dispatch({ type: "SET_DATA_IDENTITIES", payload: identities });
};
