export const chooseIdentity = (identities, dispatch, index) => {
    const updatedIdentities = identities.map((identity, idx) => ({
      ...identity,
      choosed: idx === index,
    }));
    dispatch({ type: "SET_DATA_IDENTITIES", payload: updatedIdentities });
  };
  