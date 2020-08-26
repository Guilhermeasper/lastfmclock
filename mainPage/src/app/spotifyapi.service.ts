import { Injectable } from "@angular/core";
import { stringify } from "querystring";

@Injectable({
    providedIn: "root",
})
export class SpotifyapiService {
    public myHeadersPOST = new Headers();
    public myHeadersGET = new Headers();
    public urlencodedPOST = new URLSearchParams();
    public requestOptionsPOST: RequestInit;
    public requestOptionsGET: RequestInit;
    private _token: string;
    constructor() {
        // Change the token after Basic to a base64 of your clientID from spotify API
        this.myHeadersPOST.append(
            "Authorization",
            "Basic NTFiMzA2MTVhNTlhNDNlMjkyMmZhMGE5NGU1MTIxNjA6ZmY0MTY4MmM4YzViNGRmMGI2ZTU4MGNlNzE4Mjc3Y2Y="
        );
        this.myHeadersPOST.append(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        this.myHeadersPOST.append(
            "Cookie",
            "__Host-device_id=AQB19R_w3qN4hmzvvlLc8sYq0AFO-u1Z8EqxLBsv0iZY_DlqC6OHo_0fYEOQu8QdYi5LZHK277aYL9rNw--FTvt7UiDV6mGB9TQ"
        );
        this.urlencodedPOST.append("grant_type", "client_credentials");
        this.refreshToken();
    }

    async artistAlbums(id: string) {
        this.myHeadersGET.set("Authorization", `Bearer ${this._token}`);
        this.requestOptionsGET = {
            method: "GET",
            headers: this.myHeadersGET,
            redirect: "follow",
        };

        let items = [];
        let finalResult = "";
        let next = `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album%2Csingle&limit=50`;
        do {
            let result: any;
            result = (await (await fetch(next, this.requestOptionsGET)).text());
            finalResult += result;
            console.log(JSON.parse(result));
            next = JSON.parse(result).next;
        } while (next != null);
        return finalResult;
    }

    artistSearch(artist: string) {
        this.myHeadersGET.set("Authorization", `Bearer ${this._token}`);
        this.requestOptionsGET = {
            method: "GET",
            headers: this.myHeadersGET,
            redirect: "follow",
        };
        return new Promise((resolve, reject) => {
            fetch(
                `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
                this.requestOptionsGET
            )
                .then((response) => response.text())
                .then((result) =>
                    resolve(JSON.parse(result).artists.items[0].id)
                )
                .catch((error) => console.log("error", error));
        });
    }

    refreshToken() {
        this.requestOptionsPOST = {
            method: "POST",
            headers: this.myHeadersPOST,
            body: this.urlencodedPOST,
            redirect: "follow",
        };
        fetch("https://accounts.spotify.com/api/token", this.requestOptionsPOST)
            .then((response) => response.text())
            .then((result) => {
                let resultJSON = JSON.parse(result);
                this._token = resultJSON.access_token;
            })
            .catch((error) => console.log("error", error));
    }
}
