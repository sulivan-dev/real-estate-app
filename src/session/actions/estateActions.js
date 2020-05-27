export const getData = (firebase, paginationSize, initialPage, searchText) => {
  return new Promise(async (resolve, reject) => {
    let estates = firebase.db
      .collection('estates')
      .orderBy('address')
      .limit(paginationSize);

    if (initialPage !== null) {
      estates = firebase.db
        .collection('estates')
        .orderBy('address')
        .startAfter(initialPage)
        .limit(paginationSize);

      if (searchText.trim() !== "") {
        estates = firebase.db
          .collection('estates')
          .orderBy('address')
          .where('keywords', 'array-contains', searchText.toLowerCase())
          .startAfter(initialPage)
          .limit(paginationSize);
      }
    }

    const snapshot = await estates.get();
    const estatesArray = snapshot.docs.map(doc => {
      let data = doc.data();
      let id = doc.id;

      return { id, ...data };
    })

    const initialPageValue = snapshot.docs[0];
    const finalValue = snapshot.docs[snapshot.docs.length - 1];
    const returnValue = {
      estatesArray,
      initialPageValue,
      finalValue,
    }

    resolve(returnValue);
  })
}

export const getPreviousData = (firebase, paginationSize, initialPage, searchText) => {
  return new Promise(async (resolve, reject) => {
    let estates = firebase.db
      .collection('estates')
      .orderBy('address')
      .limit(paginationSize);

    if (initialPage !== null) {
      estates = firebase.db
        .collection('estates')
        .orderBy('address')
        .startAt(initialPage)
        .limit(paginationSize);

      if (searchText.trim() !== "") {
        estates = firebase.db
          .collection('estates')
          .orderBy('address')
          .where('keywords', 'array-contains', searchText.toLowerCase())
          .startAt(initialPage)
          .limit(paginationSize);
      }
    }

    const snapshot = await estates.get();
    const estatesArray = snapshot.docs.map(doc => {
      let data = doc.data();
      let id = doc.id;

      return { id, ...data };
    })

    const initialPageValue = snapshot.docs[0];
    const finalValue = snapshot.docs[snapshot.docs.length - 1];
    const returnValue = {
      estatesArray,
      initialPageValue,
      finalValue,
    }

    resolve(returnValue);
  })
}

