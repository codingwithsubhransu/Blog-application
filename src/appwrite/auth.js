import conf from '../conf/conf'
import {Client, Account, ID} from "appwrite"

export class AuthService{
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if(userAccount) {
                //call Another function
                return this.login({email, password})

            } else{
                return userAccount
            }
        } catch (error) {
            throw error            
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser() {
        try {
            // This will now succeed if there is an active session
            return await this.account.get();
        } catch (error) {
            // This error will be thrown if there's no active session
            console.log("Appwrite service :: getCurrentUser :: no active session");
            return null;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions()
            
        } catch (error) {
            console.log("Appwrite service :: logout error", error)
        }
    }
}

const authService = new AuthService();

export default authService