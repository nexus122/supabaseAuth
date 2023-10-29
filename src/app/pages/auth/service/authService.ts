import { Injectable } from "@angular/core"
import { AuthApiError, AuthError, Session, SignInWithPasswordCredentials, SupabaseClient, User, createClient } from "@supabase/supabase-js"
import { BehaviorSubject, Observable } from "rxjs"
import { USER_STORAGE_KEY, environment } from "src/environments/environment"

// type SupabaseResponse = User | Session | AuthApiError | null
@Injectable({ providedIn: 'root' })
export class AuthService {
    private supabaseClient: SupabaseClient
    private userSubject = new BehaviorSubject<User | null>(null);

    constructor() {
        this.supabaseClient = createClient(environment.supabase.url, environment.supabase.publicKey);
        this.setUser();
    }

    get user$(): Observable<User | null> {
        return this.userSubject.asObservable();
    }

    async signIn(credentials: SignInWithPasswordCredentials): Promise<any> {
        try {
            const { data, error, ...rest } = await this.supabaseClient.auth.signInWithPassword(credentials);
            this.setUser();
            return error ? error : data;
        } catch (error) {
            return error as AuthApiError;
        }
    }

    async signUp(credentials: SignInWithPasswordCredentials): Promise<any> {
        try {
            const { data, error, ...rest } = await this.supabaseClient.auth.signUp(credentials);
            this.setUser();
            return error ? error : data;
        } catch (error) {
            return error as AuthApiError;
        }
    }

    public signOut():Promise<{error: AuthError | null}>{
        this.userSubject.next(null);
        return this.supabaseClient.auth.signOut();
    }

    private setUser(): void {
        const session = localStorage.getItem(USER_STORAGE_KEY) as unknown as User;
        this.userSubject.next(session);
    }
}