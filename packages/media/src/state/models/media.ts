import { createModel } from '@captaincodeman/rdx'
import { State, Store  } from '../store'
import { createSelector } from 'reselect'
import { firestoreLoader } from "../firebase";

// dcmnt and clctn almost act like keywords, in this context
// They are also used as suffix, such as Media
// dcmnt (document) is used in this context as you would a record or a row in a database. Corresponds to `document` in firestore
// clctn (collection) is used in this context as you would a table in a database. Corresponds to a `collection` in firestore
// field, fields, type are used as document attributes, and corresponds to the elements of a schema as you would find in a database schema, as well as fields in a firestore document

export interface Media {
  id: string,
  name: string,
  type?: string,
}


// Please note that this default export of createModel() is re-exported
// as media in ../ index.ts, then consumed by getState() below
// as state.media.
// This could be confusing, even if it does make perfect sense, eventually
export default createModel({
  state: {
    focusDcmnt: {},
    mediaClctn: {},
  },

  reducers: {
    mediaClctn(state, mediaClctn) {
      return { ...state, mediaClctn };
    },
    upsert(state, dcmnt) {
      const mediaClctn = state.mediaClctn;
      mediaClctn[dcmnt.id] = dcmnt;
      return { ...state, mediaClctn };
    },
    focusDcmnt(state, focusDcmnt) {
      return { ...state, focusDcmnt };
    },
    deleteDcmnt(state, _key: string) {
      const mediaClctn = state.mediaClctn;
      // delete mediaClctn[_key]; disabled
      return { ...state, mediaClctn };
    }

  },


  effects: (_store: Store) => ({

    async delete(_key: string) {
      // const dispatch = store.getDispatch();
      // const db = await firestoreLoader;
      // if (!!key ) {
      //   const ref = db.collection("media").doc(key)
      //   if (!!ref) {
      //       ref.delete()
      //       .then(function (_deleted) {
      //         console.log("Deleted ID: ", key);
      //         dispatch.media.deleteDcmnt(key);
      //       })
      //       .catch(function (error) {
      //         console.error("Error adding document: ", error);
      //       });
      //     }
      // } else {
      //   console.log("PETE YOU EFFED UP")
      // }
    },

    async updateDcmnt(data: Media) {
      const db = await firestoreLoader;
      const key: string = ""+data.name;
      if (!!key ) {
        const ref = db.collection("media").doc(key)
        if (!!ref) {
            ref.update(data)
            .then(function (_key) {
              window.location.replace("/media")
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
          }
      } else {
        console.log("PETE YOU EFFED UP")
      }
    },



  })
})

// see ../index.ts for where state.media below,
// is defined using default export from above
const getState = (state: State) => state.media

// creates methods such as `MediaSelectors.someval(state)`
// which would typically return state.someval
export namespace MediaSelectors {
  export const dcmntFocus = createSelector(
    [getState],
    (state) => state.focusDcmnt
  )
  export const mediaClctn = createSelector(
    [getState],
    (state) => state.mediaClctn
  )
}
