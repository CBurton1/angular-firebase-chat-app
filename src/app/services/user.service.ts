import { Observable, from, of, throwError, combineLatest } from "rxjs";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireFunctions } from "@angular/fire/functions";
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot, } from "@angular/fire/firestore";
import { switchMap, map, tap, take, defaultIfEmpty } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UserService {
  public lastVisible: QueryDocumentSnapshot<AFCA.User> | undefined;
  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private aff: AngularFireFunctions,
  ) {}

  public checkLogin(): Observable<AFCA.User | null | undefined> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<AFCA.User>(`users/${user.uid}`).valueChanges({ idField: "id" }).pipe(take(1));
        } else {
          return of(null);
        }
      }),
    );
  }

  public login(email: string, password: string): Observable<AFCA.User> {
    return from(this.auth.signInWithEmailAndPassword(email, password))
      .pipe(
        switchMap((userCredential: firebase.default.auth.UserCredential) => {
          if (!userCredential.user?.emailVerified) {
            // @ts-ignore
            return from(userCredential.user?.sendEmailVerification())
              .pipe(
                switchMap(() => {
                  return this.logout();
                }),
                switchMap(() => {
                  return throwError({ code: "auth/email-not-verified", message: "Email not verified. Please check your email for a verification email" });
                })
            );
          } else {
            const usersCollection: AngularFirestoreCollection<AFCA.User> = this.afs.collection<AFCA.User>("users");
            return from(usersCollection.doc(userCredential.user?.uid).get());
          }
        }),
        map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data()
          } as AFCA.User;
        })
      );
  }

  public readUsers(): Observable<AFCA.User[]> {
    return this.afs.collection<AFCA.User>("users").valueChanges();
  }

  public logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  public getUserById(userId: string): Observable<AFCA.User | undefined> {
    let usersCollection: AngularFirestoreCollection<AFCA.User>;
    usersCollection = this.afs.collection<AFCA.User>("users");

    return from(usersCollection.doc(userId).valueChanges()).pipe(take(1));
  }
}
