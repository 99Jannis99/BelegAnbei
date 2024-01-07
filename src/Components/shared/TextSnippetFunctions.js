const getSnippetPart = (snippetPart, snippetIdentifier, snippetList) => {
  //console.log('getSnippetPart snippetPart', snippetPart)
  //console.log('getSnippetPart snippetIdentifier', snippetIdentifier)

  try {
    const useSnippets = JSON.parse(snippetList);

    let neededSnippet = useSnippets.filter((snippet) => {
      return snippet.callname === snippetIdentifier
    })[0]

    if(neededSnippet) {
      if(neededSnippet[snippetPart]) {
        return neededSnippet[snippetPart].replace(/\s+/g, ' ');
      }
      return neededSnippet[snippetPart];
    }
  } catch(e) {
    console.log('getSnippetPart err', e)
  }
}

export { getSnippetPart };
