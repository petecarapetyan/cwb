import { createModel } from "@captaincodeman/rdx";
import { State, Store } from "../store";
import { createSelector } from "reselect";
import { authLoader, firestoreLoader } from "../firebase";

export type User = import("firebase").UserInfo;

export interface Roles {
  user: boolean;
}

export interface UserRoles {
  roles: string;
}

export interface AuthState {
  user: User | null;
  statusKnown: boolean;
  roles: Roles | null;
}

/*
This is not designed for careful engineering. 

It does exactly what it says it does, which means
it might mis-interpret your roles object in a different
way than you intended.
*/
const setDisplayProperties = (roles: Roles) => {
  for (const role in roles) {
      document.documentElement.style.setProperty(
        `--show-if-${role}`,
        roles[role] ? "block" : "none"
      );
      document.documentElement.style.setProperty(
        `--show-if-not-${role}`,
        roles[role] ? "none" : "block"
      );
  }
};

export default createModel({
  state: <AuthState>{
    user: null,
    statusKnown: false,
    roles: null
  },

  reducers: {
    signedIn(state, user: User) {
      // this shouldn't be here but for now...
      for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("page")) {
          const item = localStorage.getItem(key);
          if (!item?.startsWith("/README")) {
            console.log(user.displayName + " might want to buy" + item);
          }
        }
      }
      return { ...state, user, statusKnown: true };
    },

    signedOut(state) {
      return { ...state, user: null, statusKnown: true };
    },
    roles(state, roles: Roles) {
      return { ...state, roles };
    },
  },

  effects(store: Store) {
    return {
      async signout() {
        const auth = await authLoader;
        await auth.signOut();
      },

      async signinProvider(name: string) {
        const auth = await authLoader;
        const provider = providerFromName(name);
        await auth.signInWithRedirect(provider);
      },

      // to support signing in with other methods:
      // async signinEmailPassword(payload: { email: string, password: string }) {
      //   const auth = await authLoader
      //   await auth.signInWithEmailAndPassword(payload.email, payload.password)
      // },

      async init() {
        const auth = await authLoader;
        const dispatch = store.getDispatch();

        auth.onAuthStateChanged(async (user) => {
          if (user) {
            dispatch.auth.signedIn(user);
            dispatch.auth.subscribeRoles();
          } else {
            dispatch.auth.signedOut();
          }
        });
      },

      roles(roles: Roles){
         setDisplayProperties(roles)
      },

      async subscribeRoles() {
        const firestore = await firestoreLoader;
        if (store.getState()?.auth?.user?.uid) {
          const uid = store.getState().auth.user?.uid;
          firestore
            .collection("users")
            .doc(uid)
            .onSnapshot((doc) => {
              const userRoles = <UserRoles> doc.data()
              const roles = <Roles> JSON.parse(userRoles.roles)
              store.getDispatch().auth.roles(roles)
            });
        }
      },
    };
  },
});

function providerFromName(name: string) {
  switch (name) {
    case "google":
      return new window.firebase.auth.GoogleAuthProvider();
    // TODO: add whatever firebase auth providers are supported by the app
    // case 'facebook': return new window.firebase.auth.FacebookAuthProvider();
    // case 'twitter': return new window.firebase.auth.TwitterAuthProvider();
    default:
      throw `unknown provider ${name}`;
  }
}

const getState = (state: State) => state.auth;

export namespace AuthSelectors {
  export const user = createSelector([getState], (state) => state.user);

  export const statusKnown = createSelector(
    [getState],
    (state) => state.statusKnown
  );

  export const roles = createSelector(
    [getState],
    (state) => state.roles
  );

  export const anonymous = createSelector([user], (user) => user === null);

  export const authenticated = createSelector([user], (user) => user !== null);
}
