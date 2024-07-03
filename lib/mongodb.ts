import * as Realm from 'realm-web';

const APP_ID = "cloudflare-qfxrmet"
const API_KEY = "QcoGJySOYid5VVp0ChS85khCtFAiaZQiEGIFkJjrNU29lj2LEgDkZ4doibSxtAcO"

let App: Realm.App;

export const connect = async () => {
    try {
        const credentials = Realm.Credentials.apiKey(API_KEY);
        App = App || new Realm.App(APP_ID);
        var mongodb = await App.logIn(credentials);

        var client = mongodb.mongoClient('mongodb-atlas');
        var db = client.db('portfolio');
        return {db, mongodb}
    } catch (err) {
        console.log(err)
        return {db: null, mongodb: null}
    }
} 